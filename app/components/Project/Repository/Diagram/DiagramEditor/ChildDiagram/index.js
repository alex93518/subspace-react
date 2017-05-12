import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import styled from 'styled-components'
import { Well } from 'react-bootstrap';
import moment from 'moment';
import { getProjectPath } from 'utils/path'
import { LinkUserName, LinkUserPhoto } from 'components/shared/Links';

const DiagramInfoWell = styled(Well)`
  background: rgba(0,0,0,0.02);
`

const ChildId = styled.div`
  margin-bottom: 5px;
`

const UserName = styled(LinkUserName)`
  margin-left: 8px;
`

const ChildDiagram = ({
  childDiagram: { rawId, owner, createdAt },
  relay: { variables },
}) => (
  <DiagramInfoWell>
    <ChildId>
      <Link to={`${getProjectPath(variables)}/diagrams/${rawId}`}>
        {rawId}
      </Link>
    </ChildId>
    <div>
      <div>
        <LinkUserPhoto user={owner} width={24} height={24} />
        <UserName user={owner} />
        {', '}created {moment(createdAt).fromNow()}
      </div>
    </div>
  </DiagramInfoWell>
)

ChildDiagram.propTypes = {
  childDiagram: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(ChildDiagram, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
  },
  fragments: {
    childDiagram: () => Relay.QL`
      fragment on Diagram {
        rawId
        owner {
          ${LinkUserName.getFragment('user')}
          ${LinkUserPhoto.getFragment('user')}
        }
        createdAt
      }
    `,
  },
})
