const itemService = require('services/item');
const catchAsync = require('utils/catchAsync');
const errorMessage = require('utils/errorMessage');

exports.createItem = catchAsync(async (req, res, next) => {
  const item = await itemService.createItem(req);

  switch (item) {
    case errorMessage.ITEMTYPE_DOESNT_EXIST:
      return next({
        status: 'fail',
        statusCode: 400,
        message: "ItemType doesn't exist"
      });
    case errorMessage.ITEMMODEL_DOESNT_EXIST:
      return next({
        status: 'fail',
        statusCode: 400,
        message: "ItemModel doesn't exist"
      });
    case errorMessage.NO_ITEM:
      return next({
        status: 'fail',
        statusCode: 400,
        message: 'Item object must be sent with item key'
      });
    case errorMessage.FAILED_CREATE_ITEM:
      return next({
        status: 'fail',
        statusCode: 404,
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
    case errorMessage.NO_ITEM:
      return next({
        status: 'fail',
        statusCode: 400,
        message: 'item object must be sent with item key'
      });
    case errorMessage.FAILED_UPDATE_ITEM:
      return next({
        status: 'fail',
        statusCode: 404,
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

  if (result === errorMessage.FAILED_DELETE_ITEM) {
    return next({
      status: 'fail',
      statusCode: 404,
      message: 'delete item failed'
    });
  }

  res.status(200).json({
    status: 'success',
    message: result
  });
});

exports.getItem = catchAsync(async (req, res, next) => {
  const item = await itemService.getItem(req);

  if (item === errorMessage.ITEM_DOESNT_EXIST) {
    return next({
      status: 'fail',
      statusCode: 404,
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

  if (items === errorMessage.FAILED_GET_ALL_ITEMS) {
    return next({
      status: 'fail',
      statusCode: 404,
      message: 'get all items failed'
    });
  } else if (items === errorMessage.ISARCHIVED_NOT_DEFINED) {
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

exports.itemInfoForNewItem = catchAsync(async (req, res, next) => {
  const results = await itemService.getItemInfoForNewItem(req);

  if (results === errorMessage.FAILED_GET_ITEM_INFO) {
    return next({
      status: 'fail',
      statusCode: 404,
      message: 'get item information failed'
    });
  }

  res.status(200).json({
    status: 'success',
    results
  });
});
