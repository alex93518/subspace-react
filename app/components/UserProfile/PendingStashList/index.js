import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import Paper from 'material-ui/Paper';
import { compose, mapProps, withState } from 'recompose';
import R from 'ramda';
import { Col } from 'react-bootstrap';
import PendingStashItem from './PendingStashItem';
import {
  TitleDiv, MainRow, DivRepoName,
} from './styles';

const PendingStashList = ({
  repoNameList, stashByRepo, selectedRepo, updateSelectedRepo,
}) => (
  selectedRepo && repoNameList && repoNameList.length > 0 &&
  <div>
    <TitleDiv>Review pending pushes</TitleDiv>
    <Paper zDepth={1}>
      <MainRow>
        <Col md={3}>
          {selectedRepo &&
            repoNameList.map(name =>
              (<DivRepoName
                role="link"
                data-isActive={name === selectedRepo}
                key={`repoName${name}`}
                onClick={() => updateSelectedRepo(name)}
              >
                {name}
              </DivRepoName>)
              )
          }
        </Col>
        <Col md={9}>
          {stashByRepo[selectedRepo] && stashByRepo[selectedRepo].map(({ node }) =>
            <PendingStashItem key={`stashItem${node.id}`} gitRef={node} />
          )}
        </Col>
      </MainRow>
    </Paper>
  </div>
)

PendingStashList.propTypes = {
  stashByRepo: PropTypes.object.isRequired,
  repoNameList: PropTypes.array.isRequired,
  selectedRepo: PropTypes.string,
  updateSelectedRepo: PropTypes.func.isRequired,
}

export default compose(
  withRelayFragment({
    viewer: graphql`
      fragment PendingStashList_viewer on Viewer {
        pendingStashes: stashes(first: 99, isOnline: false){
          edges {
            node {
              repository {
                id
                name
              }
              id
              ...PendingStashItem_gitRef
            }
          }
        }
      }
    `,
  }),
  mapProps(props => {
    const groupByRepoName = R.groupBy(edge =>
      edge.node.repository.name
    )(props.viewer.pendingStashes.edges)
    return {
      stashByRepo: groupByRepoName,
      repoNameList: R.keys(groupByRepoName) || [],
      ...props,
    }
  }),
  withState(
    'selectedRepo',
    'updateSelectedRepo',
    props => props.repoNameList.length ? props.repoNameList[0] : null
  )
)(PendingStashList)
