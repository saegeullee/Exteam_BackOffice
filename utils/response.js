const Cell = require('models/cell');
const { convertDateToString } = require('utils/convertDate');

exports.responseForItemTypes = itemTypes => {
  return itemTypes.map(({ _id, models, name: itemType }) => {
    const itemModels = models.map(({ _id, name }) => {
      return { _id, name };
    });

    return { _id, itemModels, itemType };
  });
};

exports.responseForItemListForCsv = items => {
  return Promise.all(
    items.map(
      async ({
        owner,
        acquiredDate,
        tags,
        usageType,
        itemType,
        price,
        memo,
        model,
        uniqueNumberForClient
      }) => {
        if (owner) {
          cell = await Cell.findById(owner.cell);
          nickName = owner.nickName;
        }

        return {
          고유번호: itemType.name + '_' + uniqueNumberForClient,
          소속: owner ? cell.name : null,
          사용자: owner ? nickName : null,
          비품종류: itemType.name,
          모델명: model.name,
          취득일: convertDateToString(acquiredDate),
          태그: tags.join('/'),
          가격: price,
          비고: memo,
          상태: usageType
        };
      }
    )
  );
};
