const Item = require('models/item');
const ItemType = require('models/itemType');
const ItemModel = require('models/itemModel');

const validateItem = async (item, next) => {
  const { itemType, model } = item;

  if (itemType) {
    const itemTypeInDB = await ItemType.findOne({ name: itemType });
    if (itemTypeInDB) {
      item.itemType = itemTypeInDB;
    } else {
      return next({ status: 'fail', statusCode: 400, message: "ItemType doesn't exist" });
    }
  }

  if (model) {
    const itemModelInDB = await ItemModel.findOne({ name: model });
    if (itemModelInDB) {
      item.model = itemModelInDB;
    } else {
      return next({ status: 'fail', statusCode: 400, message: "ItemModel doesn't exist" });
    }
  }

  return item;
};

exports.createItem = async (req, res, next) => {
  let item = '';
  if (req.body.item) {
    item = await validateItem(req.body.item, next);
  } else {
    return 'NO_ITEM';
  }

  const insertedItem = await Item.create({
    itemType: item.itemType._id,
    model: item.model._id,
    uniqueNumber: item.uniqueNumber,
    price: item.price,
    tag: item.tag,
    memo: item.memo
  });

  if (!insertedItem) {
    return next({ status: 'fail', statusCode: 400, message: 'create item failed' });
  }

  return insertedItem;
};

exports.updateItem = async (req, res, next) => {
  let item = '';
  if (req.body.item) {
    item = await validateItem(req.body.item, next);
  } else {
    return 'NO_ITEM';
  }

  const updatedItem = await Item.findByIdAndUpdate(req.params.id, { ...item }, { new: true });

  if (!updatedItem) {
    return next({ status: 'fail', statusCode: 400, message: 'update item failed' });
  }

  return updatedItem;
};

exports.deleteItem = async (req, res, next) => {
  await Item.findByIdAndDelete(req.params.id);
};

exports.getItem = async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return next({ status: 'fail', statusCode: 400, message: "item doesn't exist" });
  }
  return item;
};

exports.getAllItems = async (req, res, next) => {
  let query = Item.find();

  //정렬
  if (req.query.sort) {
    const sortBy = req.query.sort;
    query = query.sort(sortBy);
  } else {
    query = query.sort('aquiredDate');
  }

  //페이징
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const items = await query;

  if (!items) {
    return next({ status: 'fail', statusCode: 400, message: 'get all items failed' });
  }

  return items;
};

exports.getUniqueNumberForNewItem = async (req, res, next) => {
  try {
    const currentNumbers = await Item.aggregate([
      {
        $group: {
          _id: '$itemType',
          uniqueNumber: { $max: '$uniqueNumber' }
        }
      }
    ]);

    return currentNumbers;
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
