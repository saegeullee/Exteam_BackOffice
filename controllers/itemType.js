const {
  create,
  getList,
  update,
  remove,
  getItemType,
  getItemModel
} = require('services/itemType');
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
        console.log(created);
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
      : res.status(200).json({ status: 'success', updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteItemType = async (req, res, next) => {
  try {
    const itemTypeId = req.params.itemTypeId;
    const itemModelId = req.query.modelId;

    const deleted = itemModelId
      ? await getItemModel(itemModelId)
      : await getItemType(itemTypeId);

    const isDeletionSuccess = await remove(itemTypeId, itemModelId);

    isDeletionSuccess.deletedCount === 1
      ? res.status(200).json({ status: 'success', deleted })
      : next(makeError('Check ItemTypeId or ModelId', 400));
  } catch (err) {
    next(err);
  }
};
