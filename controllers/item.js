const itemService = require('services/item');
const catchAsync = require('utils/catchAsync');

exports.createItem = catchAsync(async (req, res, next) => {
  const item = await itemService.createItem(req, res, next);

  res.status(200).json({
    status: 'success',
    message: item
  });
});

exports.updateItem = catchAsync(async (req, res, next) => {
  const item = await itemService.updateItem(req, res, next);

  res.status(200).json({
    status: 'success',
    message: item
  });
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  await itemService.deleteItem(req, res, next);

  res.status(200).json({
    status: 'success',
    message: 'item deleted'
  });
});

exports.getItem = catchAsync(async (req, res, next) => {
  const item = await itemService.getItem(req, res, next);

  res.status(200).json({
    status: 'success',
    message: item
  });
});

exports.getAllItems = catchAsync(async (req, res, next) => {
  const items = await itemService.getAllItems(req, res, next);

  res.status(200).json({
    status: 'success',
    message: items
  });
});

exports.getUniqueNumberForNewItem = async (req, res, next) => {
  try {
    const result = await itemService.getUniqueNumberForNewItem(req, res, next);

    res.status(200).json({
      status: 'success',
      result
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
