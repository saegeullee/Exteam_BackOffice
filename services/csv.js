const Member = require('models/member');
const Cell = require('models/cell');
const Item = require('models/item');
const ItemType = require('models/itemType');
const ItemModel = require('models/itemModel');
const Provision = require('models/provision');
const { checkItemModel } = require('utils/checkModels');
const { responseForItemListForCsv } = require('utils/response');
const { convertStringToDate } = require('utils/convertDate');

function splitTags(tags) {
  if (tags.includes(',')) {
    const splitTags = tags.split(',');
    const result = splitTags.map(tag => tag.trim());

    return result;
  } else {
    return tags;
  }
}

const makeItemListForCsv = async () => {
  const list = await Item.find()
    .populate('itemType', 'name')
    .populate('provisionHistories')
    .populate('model', 'name')
    .populate('owner', 'nickName cell');

  return responseForItemListForCsv(list);
};

const makeProvisionForDB = async (
  member,
  parentItem,
  usageType,
  providedAt
) => {
  const item = await Item.findOne({ _id: parentItem._id });

  const date = convertStringToDate(providedAt);

  const provision = await new Provision({
    memberId: member._id,
    givenDate: date || null,
    usageType: usageType
  }).save();

  item.provisionHistories.push(provision._id);
  item.usageType = provision.usageType;
  item.acquiredDate = provision.givenDate;
  item.save();

  return provision;
};

const makeItemForDB = async (itemType, price, tags, memo, model, owner) => {
  const itemList = await Item.find({ itemType: itemType._id }).sort(
    'uniqueNumber'
  );

  const uniqueNumber =
    itemList.length > 0 ? itemList[itemList.length - 1].uniqueNumber + 1 : 1;

  const item = await new Item({
    itemType,
    uniqueNumber,
    price,
    tags: splitTags(tags),
    memo,
    model,
    owner
  }).save();

  const result = await Item.findOne({ _id: item._id }).populate('itemType');

  const number = result.uniqueNumber.toString();
  const DIGITS_COUNT = 5;
  let zeros = '0';

  for (let i = DIGITS_COUNT - number.length; i > 1; i--) {
    zeros = zeros + '0';
  }

  const id = result.itemType.name + '_' + zeros + number;

  console.log(id);
  return result;
};

const makeItemModelForDB = async modelName => {
  const checkModel = await checkItemModel(modelName);

  let model;

  if (checkModel) {
    model = await new ItemModel({
      name: modelName
    }).save();
  } else {
    model = await ItemModel.findOne({ name: modelName });
  }

  return model;
};

const makeItemTypeForDB = async (type, model) => {
  const itemType = await ItemType.findOne({ name: type });

  if (itemType) {
    !itemType.models.includes(model._id) && itemType.models.push(model._id);
    itemType.save();
  } else {
    await new ItemType({
      name: type,
      models: model._id
    }).save();
  }

  const result = await ItemType.findOne({ name: type }).populate('models');

  return result;
};

const makeCellForDB = async cellName => {
  (await Cell.findOne({ name: cellName })) ||
    (await new Cell({
      name: cellName
    }).save());
  const cell = await Cell.findOne({ name: cellName });

  return cell;
};

const makeMemberForDB = async (memberName, cell) => {
  (await Member.findOne({ nickName: memberName })) ||
    (await new Member({
      nickName: memberName,
      cell: cell._id
    }).save());

  return await Member.findOne({ nickName: memberName }).populate(
    'cell',
    'name'
  );
};

module.exports = {
  makeMemberForDB,
  makeCellForDB,
  makeItemTypeForDB,
  makeItemModelForDB,
  makeItemForDB,
  makeProvisionForDB,
  makeItemListForCsv
};
