const groupMealService = require("services/groupMeal");
const memberService = require("services/member");
const Member = require("models/member");

exports.generateGroupMeal = async (req, res, next) => {
  const groupMeal = await groupMealService.generateGroupMeal();
  res.status(200).json(groupMeal);
};

exports.getGroupMealsHistory = async (req, res, next) => {
  const groupMealHistory = await groupMealService.getGroupMealsHistory();
  res.status(200).json(groupMealHistory);
};

exports.resetAllMembersWasDriverFieldFalse = async (req, res, next) => {
  const updatedMembersResult = await groupMealService.resetAllMembersWasDriverFieldFalse();

  if (updatedMembersResult.ok === 1) {
    res.status(200).json({
      status: "success",
      message: "successfully updated all members wasdriver field false"
    });
  }
};
