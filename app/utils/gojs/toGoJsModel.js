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
    linkDataArray: data.links ?
      data.links.edges.map(({ node }) => ({
        ...node,
        from: node.fromDiagramObjId,
        to: node.toDiagramObjId,
        points: node.points ? JSON.parse(node.points) : null,
      })) : [],
  }
  return model
}
