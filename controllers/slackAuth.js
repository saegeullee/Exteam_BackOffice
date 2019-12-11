const { getSlackAuth, getAdminId } = require('services/slackAuth');

exports.slackAuth = async (req, res, next) => {
  try {
    const access_token = await getSlackAuth(req);

    if (access_token) {
      res.status(200).json({ message: 'success', access_token });
    } else {
      const err = new Error('Auth Failed');
      err.statusCode = 401;
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

exports.checkAuth = async (req, res, next) => {
  try {
    const access_token = req.headers.authorization;

    req.adminId = getAdminId(access_token);

    next();
  } catch (err) {
    err.message = 'Auth Failed';
    err.statusCode = 401;
    next(err);
  }
};
