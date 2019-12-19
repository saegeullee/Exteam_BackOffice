const Item = require('models/item');
const Member = require('models/member');
const Provision = require('models/provision');
const { convertStringToDate } = require('utils/convertDate');

exports.getItemProvisionData = async itemId => {
  const item = await Item.findById(itemId).populate('owner provisionHistories');
  const { owner, provisionHistories } = item;

  if (provisionHistories.length === 0) {
    return '!HISTORY';
  }

  const provision = provisionHistories.map(provision => {
    if (provision.returnDate === undefined) {
      return provision;
    }
  })[item.provisionHistories.length - 1];
  // console.log(provision);
  return {
    _id: itemId,
    owner: owner.nickName,
    givenDate: provision.givenDate
  };
};

exports.returnItem = async (itemId, returnDate) => {
  const item = await Item.findById(itemId)
    .populate('itemType', 'name')
    .populate('provisionHistories');

  if (item.usageType === '재고') {
    return null;
  } else {
    const provisionId = item.provisionHistories.map(provision => {
      if (provision.returnDate === undefined) {
        return provision;
      }
    })[item.provisionHistories.length - 1]._id;

    const provision = await Provision.findById(provisionId).populate(
      'memberId',
      'nickName'
    );

    provision.returnDate = convertStringToDate(returnDate);
    await provision.save();

    item.owner = null;
    item.usageType = '재고';
    await item.save();

    return {
      item: {
        _id: item._id,
        uniqueNumber: item.itemType.name + '_' + item.uniqueNumberForClient
      },
      provision: {
        _id: provision._id,
        usageType: provision.usageType,
        givenDate: provision.givenDate,
        returnDate: provision.returnDate
      }
    };
  }
};

exports.provideItem = async (itemId, memberName, givenAt, usageType) => {
  const item = await Item.findById(itemId)
    .populate('itemType')
    .populate('provisionHistories');
  const member = await Member.findOne({ nickName: memberName });
  const givenDate = convertStringToDate(givenAt);

  if (!member) {
    return '!MEMBER';
  }

  if (item.usageType !== '재고') {
    return null;
  } else {
    const provision = await new Provision({
      memberId: member._id,
      givenDate,
      usageType
    }).save();

    item.owner = member._id;
    item.acquiredDate = item.acquiredDate || givenDate;
    item.usageType = usageType;
    item.provisionHistories.push(provision._id);
    await item.save();

    return {
      item: {
        _id: item._id,
        uniqueNumber: item.itemType.name + '_' + item.uniqueNumberForClient
      },
      provision: {
        _id: provision._id,
        usageType: provision.usageType,
        givenDate: provision.givenDate
      }
    };
  }
};
