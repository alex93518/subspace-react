import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer } from 'react-relay';
import { env } from 'relay/RelayEnvironment';
import LoadingIndicator from 'components/shared/LoadingIndicator';

const RepositoryQueryRenderer = ({ children, query, vars }) => (
  <QueryRenderer
    environment={env}
    variables={vars}
    query={query}
    render={({ error, props }) => {
      if (error) {
        throw error;
      } else if (props) {
        const {
          viewer: {
            repository,
          },
        } = props;
        return React.cloneElement(children, {
          repository,
        })
      }

      return <LoadingIndicator />;
    }}
  />
);

RepositoryQueryRenderer.propTypes = {
  query: PropTypes.func.isRequired,
  vars: PropTypes.object.isRequired,
  viewer: PropTypes.object,
  children: PropTypes.node,
};

export default RepositoryQueryRenderer
