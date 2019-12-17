const { convertDateToString } = require('utils/convertDate');

exports.responseForItemTypes = itemTypes => {
  const response = itemTypes.map(_itemType => {
    const { _id, models, name: itemType } = _itemType;

    const itemModels = models.map(model => {
      const { _id, name } = model;

      return { _id, name };
    });

    return { _id, itemModels, itemType };
  });

  return response;
};

exports.responseForItemListForCsv = items => {
  Promise.all(
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
