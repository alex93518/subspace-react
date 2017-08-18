import React from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose } from 'recompose';
import { AppBar, Badge } from './styles';

export default compose(
  withRelayFragment({
    refConnection: graphql`
      fragment Toolbar_refConnection on RefConnection {
        totalCount
      }
    `,
  })
)(
  ({ refConnection: { totalCount } }) => (
    <AppBar position="static" color="default">
      <Tabs onChange={() => ({})} value={0}>
        <Tab
          label={(
            <span>
              All <Badge
                badgeContent={totalCount}
                data-color="#757575"
              ><span /></Badge>
            </span>
          )}
        />
        <Tab
          label={(
            <span>
              Unreviewed <Badge
                badgeContent={'n'}
                data-color="#039BE5"
              ><span /></Badge>
            </span>
          )}
        />
        <Tab
          label={(
            <span>
              Accepted <Badge
                badgeContent={'n'}
                data-color="#43A047"
              ><span /></Badge>
            </span>
          )}
        />
        <Tab
          label={(
            <span>
              Rejected <Badge
                badgeContent={'n'}
                data-color="#EF5350"
              ><span /></Badge>
            </span>
          )}
        />
        <Tab
          label={(
            <span>
              Review Later <Badge
                badgeContent={'n'}
                data-color="#607D8B"
              ><span /></Badge>
            </span>
          )}
        />
      </Tabs>
    </AppBar>
  )
)
