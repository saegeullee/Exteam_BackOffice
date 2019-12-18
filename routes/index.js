const memberRouter = require('./member');
const cellRouter = require('./cell');
const groupMealRouter = require('./groupMeal');
const slackAuthRouter = require('./slackAuth');
const adminRouter = require('./admin');
const accessRouter = require('./access');

const itemRouter = require('./item');
const itemTypeRouter = require('./itemType');
const csvRouter = require('./csv');
const provisionRouter = require('./provision');

const { checkAuth } = require('controllers/slackAuth');

const router = app => {
  app.use('/slack', slackAuthRouter);
  app.use('/access', accessRouter);
  // app.use(checkAuth);

  app.use('/member', memberRouter);
  app.use('/cell', cellRouter);
  app.use('/groupmeal', groupMealRouter);
  app.use('/admin', adminRouter);

  app.use('/itemtype', itemTypeRouter);
  app.use('/csv', csvRouter);
  app.use('/provision', provisionRouter);

  app.use('/item', itemRouter);

  app.all('*', (req, res, next) => {
    const err = new Error(`can't find ${req.originalUrl} on this server`);
    err.status = 'FAIL';
    err.statusCode = 404;
    next(err);
  });

  app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  });
};

module.exports = router;
