import React, { PropTypes } from 'react';
import RichTextEditor from 'react-rte';
import Relay from 'react-relay';
import Blob from '../Blob';

const Readme = ({ readme }) => (
  readme.entries.length ?
    <Blob
      blob={readme}
      splat={'README.md'}
    /> :
    <RichTextEditor
      readOnly
      value={
        RichTextEditor.createValueFromString('No README.md file', 'html')
      }
    />
)

Readme.propTypes = {
  readme: PropTypes.object.isRequired,
}

export default Relay.createContainer(Readme, {
  fragments: {
    readme: () => Relay.QL`
      fragment on Tree {
        entries(path: "README.md") {
          oid
        }
        ${Blob.getFragment('blob', { splat: 'README.md' })}
      }
    `,
  },
})
