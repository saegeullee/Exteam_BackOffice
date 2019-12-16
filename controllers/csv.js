const {
  getMember,
  getCell,
  getItemType,
  getItemModel,
  getItem,
  provide
} = require('services/csv');
const Item = require('models/item');
const makeError = require('utils/makeError');
const csv = require('csv-parser');
const fs = require('fs');

exports.uploadCsv = (req, res, next) => {
  const file = req.files.data;
  const fileName = file.name;

  const result = [];

  file.mv('csv/' + fileName, err => {
    err ? console.log(err) : console.log('csv moved to directory');
  });

  fs.createReadStream(`csv/${fileName}`)
    .pipe(csv())
    .on('data', data => result.push(data))
    .on('end', async () => {
      try {
        for (const data of result) {
          const price = data['가격'];
          const memo = data['비고'];
          const tags = data['태그'];
          const usageType = data['상태'];
          const providedAt = data['취득일'];
          const itemModel = await getItemModel(data['모델명']);
          const itemType = await getItemType(data['비품종류'], itemModel);

          if (data['사용자']) {
            const cell = await getCell(data['소속']);
            const member = await getMember(data['사용자'], cell);
            const item = await getItem(
              itemType._id,
              price,
              tags,
              memo,
              itemModel._id,
              member._id
            );
            const provision = await provide(
              member,
              item,
              usageType,
              providedAt
            );
          } else {
            const item = await getItem(
              itemType._id,
              price,
              tags,
              memo,
              itemModel._id
            );
          }
        }

        const item = await Item.find()
          .populate('itemType', 'name')
          .populate('provisionHistories')
          .populate('model', 'name')
          .populate('owner', 'nickName');

        result.length > 0
          ? res.status(200).json({ status: 'success', data: item })
          : makeError('Something went wrong, Try again', 404);
      } catch (err) {
        console.log(err);
        next(err);
      }
    });
};
