import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components'
import { Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const ControlLabelSty = styled(ControlLabel)`
  padding-right: 10px;
`

const BranchSelect = ({
  branchSelect: {
    refs,
  },
  relay,
  onRowClick,
}) => (
  <Form inline>
    <FormGroup controlId="formInlineName">
      <ControlLabelSty>Branch:</ControlLabelSty>
      <FormControl
        name="branch"
        componentClass="select"
        onChange={e => onRowClick(
          relay.variables.isTree,
          relay.variables.splat,
          e.target.value
        )}
      >
        {refs.edges.map(refNode => {
          const name = refNode.node.name.replace('refs/heads/', '')
          return (<option key={name} value={name}>
            {name}
          </option>)
        })}
      </FormControl>
    </FormGroup>
  </Form>
)

BranchSelect.propTypes = {
  onRowClick: PropTypes.func.isRequired,
  relay: PropTypes.object.isRequired,
  branchSelect: PropTypes.object.isRequired,
}

export default Relay.createContainer(BranchSelect, {
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
})
