import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import { compose, withState, withHandlers } from 'recompose';
import FlipMove from 'react-flip-move';
import withRelayFragment from 'relay/withRelayFragment';
import Card, { CardContent } from 'components/shared/Card';
import Paper from 'material-ui/Paper';
import CommitStatus from './CommitStatus';
import Header from './Header';
import HeadSub from './HeadSub';
import Footer from './Footer';
import Form from './Form';
import {
  PendingStashPanel, ContentDiv, CommitDiv, MainCardHeader,
} from './styles';

const PendingStashItem = ({
  gitRef, isShowContent,
  // toggleShowContent,
}) => (
  !gitRef.stash.isOnline &&
  <Card>
    <MainCardHeader
      classes={{ title: 'title' }}
      title={<Header pendingStashItem={gitRef} createdAt={gitRef.stash.createdAt} />}
      subheader={<HeadSub stash={gitRef.stash} />}
    />
    <CardContent>
      <PendingStashPanel
        footer={
          isShowContent &&
          <Footer pendingStashItem={gitRef} />
        }
      >
        <FlipMove
          duration={100}
          easing="ease"
          staggerDurationBy={10}
          staggerDelayBy={15}
          enterAnimation={'accordionVertical'}
          leaveAnimation={'none'}
        >
          {
            isShowContent &&
            <div key={`reviewPendingPushContent${gitRef.id}`}>
              <ContentDiv>
                <Form
                  form={`stashForm${gitRef.id}`}
                  stashId={gitRef.stash.rawId}
                  initialValues={{
                    stashTitle: gitRef.stash.title || '',
                    stashDescription: gitRef.stash.description || '',
                  }}
                />
                <Paper elevation={1}>
                  <CommitDiv>
                    <CommitStatus commit={gitRef.target} />
                  </CommitDiv>
                </Paper>
              </ContentDiv>
            </div>
          }
        </FlipMove>
      </PendingStashPanel>
    </CardContent>
  </Card>
)

PendingStashItem.propTypes = {
  gitRef: PropTypes.object.isRequired,
  isShowContent: PropTypes.bool.isRequired,
  toggleShowContent: PropTypes.func.isRequired,
}

export default compose(
  withRelayFragment({
    gitRef: graphql`
      fragment PendingStashItem_gitRef on Ref {
        id
        name
        repository {
          name
        }
        stash {
          isOnline
          rawId
          createdAt
          title
          description
          ...HeadSub_stash
        }
        target {
          ... on Commit {
            ...CommitStatus_commit
          }
        }      
        ...Header_pendingStashItem
        ...Footer_pendingStashItem
      }
    `,
  }),
  withState('isShowContent', 'updateIsShowContent', true),
  withState('isClear', 'updateIsClear', false),
  withHandlers({
    toggleShowContent: props => () => {
      props.updateIsShowContent(!props.isShowContent)
    },
  })
)(PendingStashItem)
