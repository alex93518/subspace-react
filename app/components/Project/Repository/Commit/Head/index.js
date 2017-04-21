import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';
import { Glyphicon } from 'react-bootstrap';
import { LinkBranch } from 'components/shared/Links';

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
  commitHead: { fullMessage },
  relay: {
    variables,
    variables: {
      branchHead,
    },
  },
}) => (
  <tr>
    <Td>
      <CommitTitle>
        {fullMessage}
      </CommitTitle>
      <p>
        <Glyphicon glyph={'open'} />
        <LinkBranchSty vars={variables}>
          {branchHead}
        </LinkBranchSty>
      </p>
    </Td>
  </tr>
)

CommitHead.propTypes = {
  commitHead: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(CommitHead, {
  initialVariables: {
    branchHead: 'master',
    projectName: null,
    userName: null,
  },
  fragments: {
    commitHead: () => Relay.QL`
      fragment on Commit {
        fullMessage
      }
    `,
  },
})
