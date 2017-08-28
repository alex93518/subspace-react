import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import R from 'ramda';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import { matchRoute } from 'utils/routeMatcher';
import TreeEntry from './TreeEntry';
import FolderUp from './FolderUp';


const TableWhite = styled(Table)`
  background: white;
  border: 1px solid #DDD;
`

const sortEntries = R.sortWith([
  R.descend(R.prop('type')),
  R.ascend(R.prop(name)),
])

const Tree = ({
  tree: { entries }, params,
}) => (
  <TableWhite hover>
    <tbody>
      {
        params.splat ? <FolderUp {...params} /> : null
      }
      {sortEntries(entries).map(treeEntry =>
        (<TreeEntry
          key={treeEntry.oid}
          treeEntry={treeEntry}
        />)
      )}
    </tbody>
  </TableWhite>
)

Tree.propTypes = {
  tree: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
}

export default compose(
  withRouter,
  withRelayFragment({
    tree: graphql`
      fragment Tree_tree on Tree {
        entries(path: $splat) {
          oid
          type
          name
          ...TreeEntry_treeEntry
        }
      }
    `,
  }),
  mapProps(({
    location: { pathname },
    ...rest
  }) => {
    const params = matchRoute(pathname).params;
    const splat = params['0'] || null;
    return ({
      params: { splat, ...params },
      ...rest,
    });
  })
)(Tree);
