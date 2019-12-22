const Access = require('models/access');
const jwt = require('jsonwebtoken');

exports.checkAccess = async req => {
  const { access_key } = req.body;

  if (!access_key) {
    return 'NO_ACCESS_KEY';
  }

  const access = Array.from(await Access.find())[0];

  if (access_key === access.key) {
    return jwt.sign({ _id: access._id }, process.env.JWT_SECRET);
  } else {
    return 'INCORRECT_ACCESS_KEY';
  }
};

exports.makeAccess = async req => {
  const { new_access_key: key } = req.body;

  await new Access({
    key
  }).save();

  return 'SUCCESS';
};
