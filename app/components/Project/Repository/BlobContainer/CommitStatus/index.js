import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';
import { createContainer } from 'recompose-relay'
import { compose, mapProps } from 'recompose';
import LastCommit from 'components/shared/Project/Repository/LastCommit';
import { LinkUserPhoto } from 'components/shared/Links';

const DivCommitStatus = styled.div`
`

const DivContributor = styled.div`
  padding: 10px;
  border-top: 0px;
  border:1px solid #c8e1ff;
  border-radius:3px;
  border-top-right-radius:0;
  border-top-left-radius:0;
`

const DivFileStatus = styled.div`
  padding: 10px;
  margin-top: 15px;
  margin-bottom: -1px;
  background-color: #fafbfc;
  border:1px solid #ccc;
  border-bottom: 0px;
  border-radius:3px;
  border-bottom-right-radius:0;
  border-bottom-left-radius:0;
`

const SpanPhoto = styled.span`
  margin-left: 5px;
`

const CommitStatus = ({
  commit, contributors, totalContributors, byteSize, vars,
}) => (
  <DivCommitStatus>
    <div>
      <LastCommit lastCommit={commit} {...vars} />
    </div>
    <DivContributor>
      {totalContributors} contributors
      {' '}
      {contributors.map(user =>
        <SpanPhoto key={user.userName}>
          <LinkUserPhoto user={user} width={20} height={20} />
        </SpanPhoto>
      )}
    </DivContributor>
    <DivFileStatus>
      {byteSize}b
    </DivFileStatus>
  </DivCommitStatus>
)

CommitStatus.propTypes = {
  commit: PropTypes.object.isRequired,
  byteSize: PropTypes.number.isRequired,
  contributors: PropTypes.array.isRequired,
  totalContributors: PropTypes.number.isRequired,
  vars: PropTypes.object.isRequired,
}

export default compose(
  createContainer({
    initialVariables: {
      branchHead: 'master',
      userName: null,
      projectName: null,
    },
    fragments: {
      commitStatus: vars => Relay.QL`
        fragment on TreeEntry {
          history(first: 1, refName: $branchHead) {
            totalContributors
            contributors {
              userName
              ${LinkUserPhoto.getFragment('user')}
            }
            edges {
              node {
                ${LastCommit.getFragment('lastCommit', vars)}
              }
            }
            
          }
          object {
            ... on Blob {
              byteSize
            }
          }
        }
      `,
    },
  }),
  mapProps(({
    commitStatus: {
      history,
      object,
    },
    relay: { variables },
  }) => ({
    commit: history.edges[0].node,
    vars: variables,
    ...history,
    ...object,
  }))
)(CommitStatus)
