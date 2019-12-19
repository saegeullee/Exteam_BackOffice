const itemService = require('services/item');
const catchAsync = require('utils/catchAsync');

exports.createItem = catchAsync(async (req, res, next) => {
  const item = await itemService.createItem(req);

  switch (item) {
    case 'ITEMTYPE_DOESNT_EXIST':
      return next({
        status: 'fail',
        statusCode: 400,
        message: "ItemType doesn't exist"
      });
    case 'ITEMMODEL_DOESNT_EXIST':
      return next({
        status: 'fail',
        statusCode: 400,
        message: "ItemModel doesn't exist"
      });
    case 'NO_ITEM':
      return next({
        status: 'fail',
        statusCode: 400,
        message: 'item object must be sent with item key'
      });
    case 'FAILED_CREATE_ITEM':
      return next({
        status: 'fail',
        statusCode: 400,
        message: 'create item failed'
      });
  }

  res.status(200).json({
    status: 'success',
    message: item
  });
});

exports.updateItem = catchAsync(async (req, res, next) => {
  const item = await itemService.updateItem(req);

  switch (item) {
    case 'NO_ITEM':
      return next({
        status: 'fail',
        statusCode: 400,
        message: 'item object must be sent with item key'
      });
    case 'FAILED_UPDATE_ITEM':
      return next({
        status: 'fail',
        statusCode: 400,
        message: 'update item failed'
      });
  }

  res.status(200).json({
    status: 'success',
    message: item
  });
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  const result = await itemService.deleteItem(req);

  if (result === 'FAILED_DELETE_ITEM') {
    return next({
      status: 'fail',
      statusCode: 400,
      message: 'delete item failed'
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'successfully deleted item'
  });
});

exports.getItem = catchAsync(async (req, res, next) => {
  const item = await itemService.getItem(req);

  if (item === 'ITEM_DOESNT_EXIST') {
    return next({
      status: 'fail',
      statusCode: 400,
      message: "item doesn't exist"
    });
  }

  res.status(200).json({
    status: 'success',
    message: item
  });
});

exports.getAllItems = catchAsync(async (req, res, next) => {
  const items = await itemService.getAllItems(req);

  if (items === 'FAILED_GET_ALL_ITEMS') {
    return next({
      status: 'fail',
      statusCode: 400,
      message: 'get all items failed'
    });
  } else if (items === 'ISARCHIVED_NOT_DEFINED') {
    return next({
      status: 'fail',
      statusCode: 400,
      message: 'specify isArchived querystring to either true or false'
    });
  }
  res.status(200).json({
    status: 'success',
    message: items
  });
});

exports.getUniqueNumberForNewItem = catchAsync(async (req, res, next) => {
  const result = await itemService.getUniqueNumberForNewItem();

  if (result === 'FAILED_GET_UNIQUE_NUMBER') {
    return next({
      status: 'fail',
      statusCode: 400,
      message: 'get uniqueNumbers failed'
    });
  }

  res.status(200).json({
    status: 'success',
    result
  });
});

exports.itemInfoForNewItem = catchAsync(async (req, res, next) => {
  const results = await itemService.getItemInfoForNewItem(req);

  res.status(200).json({
    status: 'success',
    results
  });
});
