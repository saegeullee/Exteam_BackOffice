const { getAdminList, createAdmin, deleteAdmin } = require('services/admin');

exports.adminList = async (req, res, next) => {
  try {
    const adminId = req.adminId;

    const admins = await getAdminList(adminId);

    res.status(200).json({
      message: 'success',
      admins,
    });
  } catch (err) {
    next(err);
  }
};

exports.newAdmin = async (req, res, next) => {
  try {
    const data = req.body;

    const created = await createAdmin(data);

    if (created) {
      res.status(200).json({
        message: 'success',
        created,
      });
    } else {
      const err = new Error('Check Email and Name');
      err.statusCode = 400;
      next(err);
    }
  } catch (err) {
    err.message = 'Admin already exists';
    err.statusCode = 409;
    next(err);
  }
};

exports.deletion = async (req, res, next) => {
  try {
    const adminId = req.params.adminId;

    const deleted = await deleteAdmin(adminId);

    res.status(200).json({
      message: 'success',
      deleted,
    });
  } catch (err) {
    next(err);
  }
};
