const { create, getList, update } = require('services/itemType');
const { checkItemModel } = require('utils/checkModels');
const makeError = require('utils/makeError');

exports.getItemTypeList = async (req, res, next) => {
  try {
    const itemTypes = await getList();

    itemTypes.length > 0
      ? res.status(200).json({ status: 'success', itemTypes })
      : next(makeError('No ItemTypes in DB', 404));
  } catch (err) {
    next(err);
  }
};

exports.addItemType = async (req, res, next) => {
  try {
    const { itemType, itemModel } = req.body;

    if (!itemType || !itemModel) {
      next(makeError('Check Request Body', 400));
    } else {
      const checkModel = await checkItemModel(itemModel);

      if (!checkModel) {
        next(makeError('Model Name Exists', 409));
      } else {
        const created = await create(itemType, itemModel);

        res.status(200).json({ status: 'success', created });
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.updateItemType = async (req, res, next) => {
  try {
    const itemTypeId = req.params.itemTypeId;
    const itemModelId = req.query.modelId;

    const { itemType, itemModel } = req.body;

    const updated = await update(itemTypeId, itemModelId, itemType, itemModel);

    updated === 'CHECK MODEL'
      ? next(makeError('Model Name Exists', 409))
      : res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};
