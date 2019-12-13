const Model = require('models/itemModel');
const ItemType = require('models/itemType');
const { responseForItemTypes } = require('utils/response');
const { checkItemModel } = require('utils/checkModels');

exports.getList = async () => {
  const itemTypes = await ItemType.find().populate('models');

  return responseForItemTypes(itemTypes);
};

exports.create = async (itemType, itemModel) => {
  const checkModelName = await checkItemModel(itemModel);

  if (checkModelName) {
    const model = await new Model({
      name: itemModel
    }).save();

    const existingItemType = await ItemType.findOne({
      name: itemType
    });

    if (existingItemType) {
      existingItemType.models.push(model._id);
      await existingItemType.save();

      return existingItemType;
    } else {
      const newItemType = await new ItemType({
        name: itemType,
        models: model._id
      }).save();

      return newItemType;
    }
  }
};
