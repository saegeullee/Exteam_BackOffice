const { getSlackAuth, getAdminId } = require("services/slackAuth");

exports.slackAuth = async (req, res) => {
  try {
    const access_token = await getSlackAuth(req);

    access_token
      ? res.status(200).json({ message: "success", access_token })
      : res.status(401).json({ error: "Auth Failed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkAuth = async (req, res, next) => {
  try {
    const access_token = req.headers.authorization;

    req.adminId = getAdminId(access_token);

    next();
  } catch (err) {
    res.status(401).json({ error: "Auth Failed" });
  }
};
