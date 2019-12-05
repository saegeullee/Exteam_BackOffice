const Axios = require('axios');
const Admin = require('models/admin');
const jwt = require('jsonwebtoken');

exports.getSlackAuth = async req => {
  const { client_id, client_secret, code } = req.query;

  const response = await Axios.get(
    `https://slack.com/api/oauth.access?client_id=${client_id}&client_secret=${client_secret}&code=${code}`,
  );

  const { email } = response.data.user;

  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const isEmail = regex.test(email);

  const admin = isEmail ? await Admin.findOne({ email }) : null;

  return admin ? jwt.sign({ _id: admin._id }, process.env.JWT_SECRET) : null;
};

exports.getAdminId = access_token => {
  const adminId = jwt.verify(access_token, process.env.JWT_SECRET)._id;

  return adminId;
};
