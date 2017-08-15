import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { Glyphicon } from 'react-bootstrap';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import { matchRoute } from 'utils/routeMatcher';
import { Td, CommitTitle, LinkBranchSty } from './styles';

const CommitHead = ({
  commit: { fullMessage }, branchHead,
}) => (
  <tr>
    <Td>
      <CommitTitle>
        {fullMessage}
      </CommitTitle>
      <p>
        <Glyphicon glyph={'open'} />
        <LinkBranchSty>
          {branchHead}
        </LinkBranchSty>
      </p>
    </Td>
  </tr>
);

CommitHead.propTypes = {
  commit: PropTypes.object.isRequired,
  branchHead: PropTypes.string,
}

export default compose(
  withRouter,
  withRelayFragment({
    commit: graphql`
      fragment Head_commit on Commit {
        fullMessage
      }
    `,
  }),
  mapProps(({
    location: { pathname },
    ...rest
  }) => ({
    branchHead: matchRoute(pathname).params.branchHead || null,
    ...rest,
  }))
)(CommitHead);
