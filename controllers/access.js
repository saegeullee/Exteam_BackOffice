const catchAsync = require('utils/catchAsync');
const { checkAccess, makeAccess } = require('services/access');

exports.access = catchAsync(async (req, res, next) => {
  const access = await checkAccess(req);

  if (access === 'NO_ACCESS_KEY') {
    return next({ message: 'No Access Key', statusCode: 401 });
  } else if (access === 'INCORRECT_ACCESS_KEY') {
    return next({ message: 'Incorrect Access Key', statusCode: 401 });
  } else {
    res.status(200).json({ message: 'success', access_token: access });
  }
});

exports.newAccess = catchAsync(async (req, res, next) => {
  const newAccess = await makeAccess(req);

  newAccess === 'SUCCESS'
    ? res.status(200).json({ message: 'success' })
    : next({ message: 'Check New Access Key', statusCode: 400 });
});
