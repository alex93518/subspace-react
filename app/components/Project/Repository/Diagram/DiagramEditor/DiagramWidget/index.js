import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import styled from 'styled-components'
import { Well } from 'react-bootstrap';
import moment from 'moment';
import { getProjectPath } from 'utils/path'
import { LinkUserName, LinkUserPhoto } from 'components/shared/Links';
import { shortUuid } from 'utils/string'

const DiagramInfoWell = styled(Well)`
  background: rgba(0,0,0,0.02);
`

const ChildId = styled.div`
  margin-bottom: 5px;
`

const UserName = styled(LinkUserName)`
  margin-left: 8px;
`

const SvgContainer = styled.div`
  border: 1px solid #c8e1ff;
  width: 52px;
  float: left;
  margin-right: 15px;
`

const DiagramWidget = ({
  diagramWidget: { name, rawId, owner, svgThumb, createdAt },
  relay: { variables },
}) => (
  <DiagramInfoWell>
    <Link to={`${getProjectPath(variables)}/diagrams/${rawId}`}>
      <SvgContainer dangerouslySetInnerHTML={{ __html: svgThumb }} />
    </Link>
    <ChildId>
      <Link to={`${getProjectPath(variables)}/diagrams/${rawId}`}>
        {name || shortUuid(rawId)}
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

DiagramWidget.propTypes = {
  diagramWidget: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(DiagramWidget, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
  },
  fragments: {
    diagramWidget: () => Relay.QL`
      fragment on Diagram {
        name
        rawId
        svgThumb
        owner {
          ${LinkUserName.getFragment('user')}
          ${LinkUserPhoto.getFragment('user')}
        }
        createdAt
      }
    `,
  },
})
