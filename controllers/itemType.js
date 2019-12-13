const { create } = require('services/itemType');
const makeError = require('utils/makeError');

exports.addItemType = async (req, res, next) => {
  try {
    const { itemType, itemModel } = req.body;

    if (!itemType || !itemModel) {
      next(makeError('Check Request Body', 400));
    } else {
      const created = create(itemType, itemModel);

      res.status(200).json({ status: 'success', created });
    }
  } catch (err) {
    next(err);
  }
};
