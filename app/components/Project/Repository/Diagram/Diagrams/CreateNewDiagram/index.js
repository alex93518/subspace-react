import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { Well } from 'react-bootstrap';
import { getProjectPath } from 'utils/path';
import MdAddCircleOutline from 'react-icons/lib/md/add-circle-outline';

const CreateNewWell = styled(Well)`
  text-align: center;
  background: rgba(0,0,0,0.01);
`

const CreateNewIcon = styled(MdAddCircleOutline)`
  width: 30px;
  height: 30px;
`

const CreateNewDiagram = ({ variables }) => (
  <CreateNewWell>
    <Link to={`${getProjectPath(variables)}/diagrams/new`}>
      <div>
        <CreateNewIcon />
      </div>
      <span>Create new</span>
    </Link>
  </CreateNewWell>
)

CreateNewDiagram.propTypes = {
  variables: PropTypes.object.isRequired,
}

export default CreateNewDiagram
