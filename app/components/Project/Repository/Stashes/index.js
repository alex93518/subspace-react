import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import MainGrid from 'components/shared/MainGrid';
import StashListItem from './StashListItem'

const Stashes = ({
  stashes: { stashes: { edges } },
  relay: { variables },
}) => (
  <MainGrid>
    <div>
      {
        edges && edges.map(({ node, node: { id } }) =>
          <StashListItem key={id} stashListItem={node} {...variables} />
        )
      }
    </div>
  </MainGrid>
)

Stashes.propTypes = {
  stashes: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(Stashes, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
  },
  fragments: {
    stashes: vars => Relay.QL`
      fragment on Repository {
        stashes(first: 99) {
          edges {
            node {
              id
              ${StashListItem.getFragment('stashListItem', vars)}
            }
          }
        }
      }
    `,
  },
})
