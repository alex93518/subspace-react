import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components'
import { createContainer } from 'recompose-relay'
import { compose, withHandlers } from 'recompose'
import { redirect } from 'redux/utils'
import { Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const ControlLabelSty = styled(ControlLabel)`
  padding-right: 10px;
`

const BranchSelect = ({
  branchSelect: { refs },
  handleBranchChange,
  currentBranch,
}) => (
  <Form inline>
    <FormGroup controlId="formInlineName">
      <ControlLabelSty>Branch:</ControlLabelSty>
      <FormControl
        name="branch"
        value={currentBranch}
        componentClass="select"
        onChange={handleBranchChange}
      >
        {refs.edges.map(refNode => {
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
  currentBranch: PropTypes.string.isRequired,
}

export default compose(
  createContainer({
    fragments: {
      branchSelect: () => Relay.QL`
        fragment on Repository {
          refs(first: 99) {
            edges {
              node {
                name
              }
            }
          }
        }
      `,
    },
  }),
  withHandlers({
    handleBranchChange: props => event => {
      redirect(`${props.projectPath}/${event.target.value}`)
    },
  }),
)(BranchSelect)
