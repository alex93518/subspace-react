import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import styled from 'styled-components';
import { Glyphicon } from 'react-bootstrap';
import { LinkBranch } from 'components/shared/Links';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import { matchRoute } from 'utils/routeMatcher';

const Td = styled.td`
  padding: 5px 15px !important;
  background-color: #eaf5ff;
`

const CommitTitle = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #555;
`

const LinkBranchSty = styled(LinkBranch)`
  color: #444d56;
  margin-left: 5px;
`

const CommitHead = ({
  commitHead: { fullMessage }, branchHead,
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
  commitHead: PropTypes.object.isRequired,
  branchHead: PropTypes.string,
}

export default compose(
  withRouter,
  withRelayFragment({
    commitHead: graphql`
      fragment Head_commitHead on Commit {
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
