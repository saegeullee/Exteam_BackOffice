const memberRouter = require("./member");
const cellRouter = require("./cell");
const groupMealRouter = require("./groupMeal");

const router = app => {
  app.use("/member", memberRouter);
  app.use("/cell", cellRouter);
  app.use("/groupmeal", groupMealRouter);

  app.all("*", (req, res, next) => {
    const err = new Error(`can't find ${req.originalUrl} on this server`);
    err.status = "FAIL";
    err.statusCode = 404;
    next(err);
  });

  app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  });
};

module.exports = router;
