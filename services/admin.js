const Admin = require("models/admin");

exports.getAdminList = async adminId => {
  const admins = await Admin.find({ _id: { $ne: adminId } });

  return admins;
};

exports.createAdmin = async data => {
  const admin = await new Admin(data).save();

  return admin;
};

exports.deleteAdmin = async () => {
  const adminToBeDeleted = await Admin.findOne({ _id: adminId });

  await Admin.deleteOne({ _id: adminToBeDeleted._id });

  return adminToBeDeleted;
};
