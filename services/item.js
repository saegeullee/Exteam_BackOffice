const itemTypeService = require('services/itemType');
const Item = require('models/item');
const ItemType = require('models/itemType');
const ItemModel = require('models/itemModel');
const Provision = require('models/provision');
const uniqueNumberFormatter = require('utils/uniqueNumberFormatter');

exports.createItem = async req => {
  let item = '';
  if (req.body.item) {
    item = await validateItem(req.body.item);
    if (item.message) {
      return item.message;
    }
  } else {
    return 'NO_ITEM';
  }

  const insertedItem = await Item.create({
    itemType: item.itemType._id,
    model: item.model._id,
    uniqueNumber: item.uniqueNumber,
    price: item.price,
    tags: item.tags,
    memo: item.memo
  });

  if (!insertedItem) {
    return 'FAILED_CREATE_ITEM';
  }

  return insertedItem;
};

exports.updateItem = async req => {
  let item = '';
  if (req.body.item) {
    if (req.body.item.itemType || req.body.item.model) {
      item = await validateItem(req.body.item);
    } else {
      item = req.body.item;
    }
  } else {
    return 'NO_ITEM';
  }

  const updatedItem = await Item.findByIdAndUpdate(
    req.params.id,
    { ...item },
    { new: true, runValidators: true }
  );

  if (!updatedItem) {
    return 'FAILED_UPDATE_ITEM';
  }

  return updatedItem;
};

exports.deleteItem = async req => {
  const result = await Item.findByIdAndDelete(req.params.id);

  if (!result) {
    return 'FAILED_DELETE_ITEM';
  }
  return result;
};

exports.getItem = async req => {
  const item = await Item.findById(req.params.id)
    .populate({ path: 'itemType', select: 'name' })
    .populate({ path: 'model', select: 'name' })
    .populate({ path: 'owner', select: 'nickName' })
    .populate({
      path: 'provisionHistories',
      populate: {
        path: 'memberId',
        select: 'nickName cell',
        populate: {
          path: 'cell',
          select: 'name'
        }
      }
    });

  if (!item) {
    return 'ITEM_DOESNT_EXIST';
  }

  return item;
};

exports.getAllItems = async req => {
  let query = '';
  let requestedItemTotalNum = 0;
  let queryCondition = {};

  if (req.query.isArchived) {
    const isArchived = req.query.isArchived;
    if (isArchived === 'true') {
      //폐기한 모든 아이템  GET
      queryCondition = { isArchived: true };
      query = Item.find(queryCondition);
    } else {
      if (req.query.usageType) {
        if (decodeURI(req.query.usageType).split('"')[1] === '재고') {
          queryCondition = { isArchived: false, usageType: '재고' };
          query = Item.find(queryCondition);
        } else {
          queryCondition = {
            isArchived: false,
            usageType: { $in: ['지급', '대여'] }
          };
          query = Item.find(queryCondition);
        }
      } else {
        queryCondition = { isArchived: false };
        query = Item.find(queryCondition);
      }
    }

    requestedItemTotalNum = await Item.countDocuments(queryCondition);
  } else {
    return 'ISARCHIVED_NOT_DEFINED';
  }

  //정렬
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-acquiredDate');
  }

  //페이징
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const items = await query
    .populate({ path: 'itemType', select: 'name' })
    .populate({ path: 'model', select: 'name' })
    .populate({
      path: 'owner',
      select: 'nickName cell',
      populate: { path: 'cell', select: 'name' }
    });

  if (!items) {
    return 'FAILED_GET_ALL_ITEMS';
  }

  return { items, itemTotalNum: requestedItemTotalNum };
};

// 새로운 아이템을 만드는 페이지에서 요청하는 서비스
// 새로운 아이템을 만들기 위해서 필요한 아이템 비품 종류, 각 비품 종류의 모델, 해당 비품의 고유번호를 보내줌
exports.getItemInfoForNewItem = async () => {
  let itemTypeInfo = await itemTypeService.getList();

  const uniqueNumberForEachItemTypeArr = await getUniqueNumberForNewItem();

  itemTypeInfo = itemTypeInfo.map(el => {
    for (let i = 0; i < uniqueNumberForEachItemTypeArr.length; i++) {
      if (el.itemType === uniqueNumberForEachItemTypeArr[i].name) {
        el.uniqueNumberForClient =
          uniqueNumberForEachItemTypeArr[i].uniqueNumberForClient;
        el.uniqueNumber = uniqueNumberForEachItemTypeArr[i].uniqueNumber;
      }
    }
    return el;
  });

  return itemTypeInfo;
};

const getUniqueNumberForNewItem = async () => {
  let uniqueNumberOfEachItemType = await Item.aggregate([
    {
      $group: {
        _id: '$itemType',
        uniqueNumber: { $max: '$uniqueNumber' }
      }
    }
  ]);

  if (!uniqueNumberOfEachItemType) {
    return 'FAILED_GET_UNIQUE_NUMBER';
  }

  uniqueNumberOfEachItemType = await Promise.all(
    uniqueNumberOfEachItemType.map(async el => {
      const itemType = await ItemType.findById(el._id);
      const uniqueNumberForClient = uniqueNumberFormatter.getFormattedUniqueNumber(
        el.uniqueNumber + 1
      );
      const uniqueNumber = el.uniqueNumber + 1;
      return { name: itemType.name, uniqueNumber, uniqueNumberForClient };
    })
  );

  return uniqueNumberOfEachItemType;
};

const validateItem = async item => {
  const { itemType, model } = item;

  const itemTypeInDB = await ItemType.findOne({ name: itemType });
  if (itemTypeInDB) {
    item.itemType = itemTypeInDB;
  } else {
    item.message = 'ITEMTYPE_DOESNT_EXIST';
  }

  const itemModelInDB = await ItemModel.findOne({ name: model });
  if (itemModelInDB) {
    item.model = itemModelInDB;
  } else {
    item.message = 'ITEMMODEL_DOESNT_EXIST';
  }
  return item;
};
