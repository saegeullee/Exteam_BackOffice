const Access = require('models/access');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.checkAccess = async req => {
  const { access_key } = req.body;

  if (!access_key) {
    return 'NO_ACCESS_KEY';
  }

  const access = Array.from(await Access.find())[0];

  if (await bcrypt.compare(access_key, access.key)) {
    return jwt.sign({ _id: access._id }, process.env.JWT_SECRET);
  } else {
    return 'INCORRECT_ACCESS_KEY';
  }
};

exports.makeAccess = async req => {
  const { new_access_key } = req.body;

  const saltRounds = 10;

  const hashedKey = await bcrypt.hash(new_access_key, saltRounds);

  const newAccess = await new Access({
    key: hashedKey,
  }).save();

  return 'SUCCESS';
};
