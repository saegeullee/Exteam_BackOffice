const Model = require('models/itemModel');
const ItemType = require('models/itemType');
const makeError = require('utils/makeError');

exports.create = async (itemType, itemModel) => {
  const doesModelExist = await Model.findOne({ name: itemModel });

  if (doesModelExist) {
    next(makeError('Model Exists', 409));
  } else {
    const model = await new Model({
      name: itemModel
    }).save();

    const modelId = model._id;

    const existingItemType = await ItemType.findOne({
      name: itemType
    });

    if (existingItemType) {
      existingItemType.models.push(modelId);
      existingItemType.save();

      return existingItemType;
    } else {
      const newItemType = await new ItemType({
        name: itemType,
        models: modelId
      }).save();

      return newItemType;
    }
  }
};
