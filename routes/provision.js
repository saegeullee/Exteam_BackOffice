const express = require('express');
const router = express.Router();
const Item = require('models/item');
const { returnItem, provideItem } = require('services/provision');
const makeError = require('utils/makeError');

router.post('/:itemId', async (req, res, next) => {
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
      provided === null
        ? next(makeError('Not returned yet', 400))
        : res.status(200).json({ status: 'success', provided });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
