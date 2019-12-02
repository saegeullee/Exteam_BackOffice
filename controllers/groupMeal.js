const groupMealService = require("services/groupMeal");
const Group = require("models/group");

exports.getGroupMeals = async (req, res, next) => {
  const groupMeal = await groupMealService.getGroupMeals();
  res.status(200).json(groupMeal);
};

exports.getLastGroupMealHistory = async (req, res, next) => {
  const groupMealHistory = await groupMealService.getLastGroupMealHistory();
  res.status(200).json(groupMealHistory);
};

exports.saveGroupMealHistory = async (req, res, next) => {
  const result = await groupMealService.saveGroupMealHistory(req, res, next);
  if (result === "success") {
    res.status(200).json({
      status: "success",
      message: "successfully saved group meals history"
    });
  } else if (result === "NO_GROUP_MEALS") {
    next({ message: "NO_GROUP_MEALS", statusCode: 400 });
  }
};

exports.testMongoose = async (req, res, next) => {
  const group = await Group.find({}, {}, { sort: { createdAt: -1 } }).limit(2);
  res.status(200).json({
    group
  });
};

exports.resetAllMembersWasDriverFieldFalse = async (req, res, next) => {
  await groupMealService.resetAllMembersWasDriverFieldFalse();
};
