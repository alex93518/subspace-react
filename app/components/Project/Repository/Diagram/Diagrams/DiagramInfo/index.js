import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { Well } from 'react-bootstrap';
import moment from 'moment';
import { getProjectPath } from 'utils/path'
import { LinkUserName, LinkUserPhoto } from 'components/shared/Links';

const DiagramInfoWell = styled(Well)`
  background: rgba(0,0,0,0.02);
`

const Title = styled.h4`
  margin-top: 0;
`

const UserName = styled(LinkUserName)`
  margin-left: 8px;
`

const SvgContainer = styled.div`
  border: 1px solid #c8e1ff;
  width: 242px;
`

const DiagramInfo = ({
  diagramInfo: {
    rawId, name, description, svg, owner, createdAt,
    childs: { totalCount },
  },
  relay: { variables },
}) => (
  <DiagramInfoWell>
    <Link to={`${getProjectPath(variables)}/diagrams/${rawId}`}>
      <Title>{name || 'Untitled'}</Title>
    </Link>
    <Link to={`${getProjectPath(variables)}/diagrams/${rawId}`}>
      <SvgContainer dangerouslySetInnerHTML={{ __html: svg }} />
    </Link>
    <hr />
    <div>
      <div>
        <LinkUserPhoto user={owner} width={24} height={24} />
        <UserName user={owner} />
        {', '}created {moment(createdAt).fromNow()}
      </div>
    </div>
    {
      description ? (
        <div>
          <hr />
          <div>
            {description}
          </div>
        </div>
      ) : null
    }
    <hr />
    <div>
      Child diagrams: {totalCount}
    </div>
  </DiagramInfoWell>
)

DiagramInfo.propTypes = {
  diagramInfo: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(DiagramInfo, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
  },
  fragments: {
    diagramInfo: () => Relay.QL`
      fragment on Diagram {
        rawId
        name
        description
        svg
        owner {
          ${LinkUserName.getFragment('user')}
          ${LinkUserPhoto.getFragment('user')}
        }
        childs {
          totalCount
        }
        createdAt
      }
    `,
  },
})
