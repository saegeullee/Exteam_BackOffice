const Model = require('models/itemModel');
const ItemType = require('models/itemType');
const { responseForItemTypes } = require('utils/response');
const { checkItemModel } = require('utils/checkModels');

exports.getList = async () => {
  const itemTypes = await ItemType.find()
    .sort('name')
    .select('_id models name')
    .populate('models');

  return responseForItemTypes(itemTypes);
};

exports.getItemType = async itemTypeId => {
  const itemType = await ItemType.findOne(
    { _id: itemTypeId },
    '_id models name'
  ).populate('models', 'name');

  return itemType;
};

exports.getItemModel = async itemModelId => {
  const itemModel = await Model.findOne({ _id: itemModelId });

  return itemModel;
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
    } else {
      await new ItemType({
        name: itemType,
        models: model._id
      }).save();
    }

    const item = await ItemType.findOne({ name: itemType }).populate(
      'models',
      'name'
    );

    return item;
  }
};

exports.update = async (itemTypeId, itemModelId, itemType, itemModel) => {
  const modelCheck = await checkItemModel(itemModel);

  if (!modelCheck) {
    return 'CHECK MODEL';
  }

  itemModelId &&
    itemModel.length > 0 &&
    (await Model.updateOne(
      { _id: itemModelId },
      { name: itemModel },
      { omitUndefined: true }
    ));

  itemType.length > 0 &&
    (await ItemType.updateOne(
      { _id: itemTypeId },
      { name: itemType },
      { omitUndefined: true }
    ));

  const updated = ItemType.findOne(
    { _id: itemTypeId },
    '_id models name'
  ).populate('models', 'name');

  return updated;
};

exports.remove = (itemTypeId, itemModelId) => {
  if (itemModelId) {
    return Model.deleteOne({ _id: itemModelId });
  } else {
    return ItemType.deleteOne({ _id: itemTypeId });
  }
};
