const { checkAccess, makeAccess } = require('services/access');
const makeError = require('utils/makeError');

exports.access = async (req, res, next) => {
  const access = await checkAccess(req);

  if (access === 'NO_ACCESS_KEY') {
    next(makeError({ message: 'No Access Key', statusCode: 401 }));
  } else if (access === 'INCORRECT_ACCESS_KEY') {
    next(makeError({ message: 'Incorrect Access Key', statusCode: 401 }));
  } else {
    res.status(200).json({ message: 'success', access_token: access });
  }
};

exports.newAccess = async (req, res, next) => {
  const newAccess = await makeAccess(req);

  newAccess === 'SUCCESS'
    ? res.status(200).json({ message: 'success' })
    : next(makeError({ message: 'Check New Access Key', statusCode: 400 }));
};
