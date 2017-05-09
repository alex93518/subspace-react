import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import styled from 'styled-components'
import { createContainer } from 'recompose-relay'
import { compose, withHandlers } from 'recompose'
import { redirect } from 'redux/utils'
import { Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { getProjectPath } from 'utils/path';

const ControlLabelSty = styled(ControlLabel)`
  padding-right: 10px;
`

const BranchSelect = ({
  branchSelect: { branches },
  handleBranchChange,
  relay: {
    variables: {
      branchHead,
      isStashes,
    },
  },
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
  branchSelect: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default compose(
  createContainer({
    initialVariables: {
      branchHead: 'master',
      userName: null,
      projectName: null,
      isStashes: false,
    },
    prepareVariables: vars => {
      if (vars.branchHead.indexOf('stash-') !== -1) {
        return {
          ...vars,
          isStashes: true,
        }
      }
      return vars
    },
    fragments: {
      /*eslint-disable */
      branchSelect: () => Relay.QL`
        fragment on Repository {
          branches: refs(first: 99) @skip(if: $isStashes) {
            edges {
              node {
                name
              }
            }
          }
          branches: stashes(first: 99) @include(if: $isStashes) {
            edges {
              node {
                name
              }
            }
          }
        }
      `,
      /*eslint-disable */
    },
  }),
  withHandlers({
    handleBranchChange: ({ suffix, relay: { variables } }) => event => {
      const suffixPath = suffix ? `/${suffix}` : ''
      redirect(`${getProjectPath(variables)}/${event.target.value}${suffixPath}`)
    },
  }),
)(BranchSelect)
