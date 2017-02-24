import React, { PropTypes } from 'react';
import Relay from 'react-relay';

function Project({ project }) {
  return <div>{project.name}</div>;
}

Project.propTypes = {
  project: PropTypes.object.isRequired,
};

export default Relay.createContainer(Project, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id,
        name
      }
    `,
  },
});
