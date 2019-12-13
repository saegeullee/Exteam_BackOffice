const { create, getList } = require('services/itemType');
const { checkItemModel } = require('utils/checkModels');
const makeError = require('utils/makeError');

exports.getItemTypeList = async (req, res, next) => {
  try {
    const itemTypes = await getList();

    if (itemTypes.length > 0) {
      res.status(200).json({ status: 'success', itemTypes });
    } else {
      next(makeError('No ItemTypes in DB', 404));
    }
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
