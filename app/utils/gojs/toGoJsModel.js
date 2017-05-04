export const toGoJsModel = data => {
  const model = {
    class: 'go.GraphLinksModel',
    nodeDataArray: data.objects ?
      data.objects.map(object => ({
        ...object,
        key: object.objectId,
      })) : [],
  }
  return model
}
