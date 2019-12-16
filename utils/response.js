exports.responseForItemTypes = itemTypes => {
  const response = itemTypes.map(_itemType => {
    const { _id, models, name: itemType } = _itemType;

    const itemModels = models.map(model => {
      const { _id, name } = model;

      return { _id, name };
    });

    return { _id, itemModels, itemType };
  });

  return response;
};
