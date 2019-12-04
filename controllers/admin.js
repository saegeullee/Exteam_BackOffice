const { getAdminList, createAdmin, deleteAdmin } = require("services/admin");

exports.adminList = async (req, res) => {
  try {
    const admins = await getAdminList();

    res.status(200).json({
      message: "success",
      admins
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

exports.newAdmin = async (req, res) => {
  try {
    const data = req.body;

    const created = await createAdmin(data);

    created !== {}
      ? res.status(200).json({
          message: "success",
          created
        })
      : res.status(400).json({ err: "Bad Request" });
  } catch (err) {
    res.status(409).json({ err: "Admin already exists" });
  }
};

exports.deletion = async (req, res) => {
  try {
    const adminId = req.params.adminId;

    const deleted = await deleteAdmin(adminId);

    res.status(200).json({
      message: "success",
      deleted
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err.message });
  }
};
