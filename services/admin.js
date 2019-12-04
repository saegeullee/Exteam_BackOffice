const Admin = require("models/admin");

exports.getAdminList = async adminId => {
  const admins = await Admin.find({ _id: { $ne: adminId } });

  return admins;
};

exports.createAdmin = async data => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const email = data.email;

  const isEmail = regex.test(email);

  const admin = data !== {} && isEmail ? await new Admin(data).save() : null;

  return admin;
};

exports.deleteAdmin = async adminId => {
  const adminToBeDeleted = await Admin.findOne({ _id: adminId });

  await Admin.deleteOne({ _id: adminToBeDeleted._id });

  return adminToBeDeleted;
};
