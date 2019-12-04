const groupMealService = require("services/groupMeal");
const catchAsync = require("utils/catchAsync");

exports.getGroupMeals = catchAsync(async (req, res, next) => {
  const groupMeal = await groupMealService.getGroupMeals();
  res.status(200).json(groupMeal);
});

exports.getLastGroupMealHistory = catchAsync(async (req, res, next) => {
  const groupMealHistory = await groupMealService.getLastGroupMealHistory();
  res.status(200).json(groupMealHistory);
});

exports.saveGroupMealHistory = catchAsync(async (req, res, next) => {
  const result = await groupMealService.saveGroupMealHistory(req, res, next);
  if (result === "success") {
    res.status(200).json({
      status: "success",
      message: "successfully saved group meals history"
    });
  } else if (result === "NO_GROUP_MEALS") {
    next({ message: "NO_GROUP_MEALS", statusCode: 400 });
  }
});
