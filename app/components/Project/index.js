import React, { PropTypes } from 'react';
import Relay from 'react-relay';

class Project extends React.Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
  }

  render() {
    const { project } = this.props;
    return <div>{project.name}</div>;
  }
}

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
