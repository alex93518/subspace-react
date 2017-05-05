export const toGoJsModel = data => {
  const model = {
    class: 'go.GraphLinksModel',
    nodeDataArray: data.objects ?
      data.objects.edges.map(({ node }) => ({
        ...node,
        key: node.objectId,
        width: node.width || { class: 'NaN' },
        height: node.height || { class: 'NaN' },
      })) : [],
  }
  return model
}
