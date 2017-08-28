import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import styled from 'styled-components';
import { compose, withHandlers, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import { redirect } from 'redux/utils'
import { Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { getProjectPath } from 'utils/path';
import { matchRoute, matchName } from 'utils/routeMatcher';

const ControlLabelSty = styled(ControlLabel)`
  padding-right: 10px;
`

const BranchSelect = ({
  branches, handleBranchChange, isStashes, branchHead,
}) => (
  <Form inline>
    <FormGroup controlId="formInlineName">
      <ControlLabelSty>{isStashes ? 'Stash' : 'Branch'}:</ControlLabelSty>
      <FormControl
        name="branch"
        value={branchHead}
        componentClass="select"
        onChange={handleBranchChange}
      >
        {branches.edges.map(refNode => {
          const name = refNode.node.name.replace('refs/heads/', '')
          return (
            <option key={name} value={name}>
              {name}
            </option>
          )
        })}
      </FormControl>
    </FormGroup>
  </Form>
)

BranchSelect.propTypes = {
  handleBranchChange: PropTypes.func.isRequired,
  branches: PropTypes.object.isRequired,
  isStashes: PropTypes.bool,
  branchHead: PropTypes.string,
};

export default compose(
  withRouter,
  withRelayFragment({
    repository: graphql`
      fragment BranchSelect_repository on Repository {
        refBranches: refs(first: 99) @skip(if: $isStashes) {
          edges {
            node {
              name
            }
          }
        }
        stashBranches: stashes(first: 99) @include(if: $isStashes) {
          edges {
            node {
              name
            }
          }
        }
      }
    `,
  }),
  mapProps(({
    location: { pathname },
    repository: {
      refBranches, stashBranches,
    },
    ...rest
  }) => {
    const params = matchRoute(pathname).params;
    return ({
      branches: refBranches || stashBranches,
      isStashes: matchName(pathname) === 'Stashes',
      branchHead: params.branchHead || 'master',
      params,
      ...rest,
    })
;
  }),
  withHandlers({
    handleBranchChange: ({ suffix, params }) => event => {
      const suffixPath = suffix ? `/${suffix}` : ''
      redirect(`${getProjectPath(params)}/${event.target.value}${suffixPath}`);
    },
  }),
)(BranchSelect)
