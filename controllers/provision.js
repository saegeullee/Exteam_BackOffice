const {
  returnItem,
  provideItem,
  getItemProvisionData
} = require('services/provision');
const makeError = require('utils/makeError');

exports.getProvisionData = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const data = await getItemProvisionData(itemId);

    data === '!HISTORY'
      ? next(makeError('No history', 400))
      : res.status(200).json({ status: 'success', data });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.provideItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { givenDate, memberName, returnDate, usageType } = req.body;

    if (returnDate) {
      const returned = await returnItem(itemId, returnDate);

      const Item = require('models/item');
      const item = await Item.findById(itemId).populate(
        'provisionHistories owner'
      );
      console.log(item);
      returned === null
        ? next(makeError('Not provided yet', 400))
        : res.status(200).json({ status: 'success', returned });
    } else {
      if (!givenDate || !memberName || !usageType) {
        next(makeError('Check Data', 400));
      }
      const provided = await provideItem(
        itemId,
        memberName,
        givenDate,
        usageType
      );

      const Item = require('models/item');
      const item = await Item.findById(itemId).populate(
        'provisionHistories owner'
      );
      console.log(item);

      provided === '!MEMBER'
        ? next(makeError('Not a member', 400))
        : provided === null
        ? next(makeError('Not returned yet', 400))
        : res.status(200).json({ status: 'success', provided });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
