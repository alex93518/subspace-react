import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components'
import { compose, withHandlers } from 'recompose'
import { redirect } from 'redux/utils'
import { Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const ControlLabelSty = styled(ControlLabel)`
  padding-right: 10px;
`

const enhance = compose(
  withHandlers({
    onChange: props => event => {
      redirect(`${props.projectPath}/${event.target.value}`)
    },
  })
)

const BranchSelect = enhance(({
  branchSelect: {
    refs,
  },
  onChange,
}) => (
  <Form inline>
    <FormGroup controlId="formInlineName">
      <ControlLabelSty>Branch:</ControlLabelSty>
      <FormControl
        name="branch"
        componentClass="select"
        onChange={onChange}
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
))

BranchSelect.propTypes = {
  projectPath: PropTypes.string.isRequired,
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
