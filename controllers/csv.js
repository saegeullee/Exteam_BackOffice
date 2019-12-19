const Item = require('models/item');
const makeError = require('utils/makeError');
const stringify = require('csv-stringify');
const csvtojson = require('csvtojson');
const {
  makeMemberForDB,
  makeCellForDB,
  makeItemTypeForDB,
  makeItemModelForDB,
  makeItemForDB,
  makeProvisionForDB,
  makeItemListForCsv
} = require('services/csv');

exports.downloadCsv = async (req, res, next) => {
  try {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="' + 'DATA.csv"'
    );
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Pragma', 'no-cache');

    const data = await makeItemListForCsv();

    data.length > 0
      ? stringify(data, { header: true }).pipe(res)
      : makeError('No Data', 404);
  } catch (err) {
    next(err);
  }
};

exports.uploadCsv = async (req, res, next) => {
  try {
    const result = await csvtojson().fromFile(req.file.path);

    for (const data of result) {
      const price = data['가격'];
      const memo = data['비고'];
      const tags = data['태그'];
      const usageType = data['상태'];
      const providedAt = data['취득일'];
      const itemModel = await makeItemModelForDB(data['모델명']);
      const itemType = await makeItemTypeForDB(data['비품종류'], itemModel);

      if (data['사용자']) {
        const cell = await makeCellForDB(data['소속']);
        const member = await makeMemberForDB(data['사용자'], cell);
        const item = await makeItemForDB(
          itemType._id,
          price,
          tags,
          memo,
          itemModel._id,
          member._id
        );

        await makeProvisionForDB(member, item, usageType, providedAt);
      } else {
        await makeItemForDB(itemType._id, price, tags, memo, itemModel._id);
      }
    }
    // const item = await Item.find()
    //   .populate('itemType', 'name')
    //   .populate({
    //     path: 'provisionHistories',
    //     populate: { path: 'memberId', select: 'nickName' }
    //   })
    //   .populate('model', 'name')
    //   .populate('owner', 'nickName');
    const itemCount = await Item.countDocuments();

    result.length > 0
      ? res.status(200).json({ status: 'success', totalItems: itemCount })
      : makeError('Something went wrong, Try again', 404);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
