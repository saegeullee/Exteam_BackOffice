const GroupMealsGeneratingService = require("classes/groupMeal");
const History = require("models/history");
const Member = require("models/member");

exports.generateGroupMeal = async () => {
  const groupMeals = new GroupMealsGeneratingService();
  const groupMeal = await groupMeals.generateGroupMeals();
  return groupMeal;
};

exports.getGroupMealsHistory = async () => {
  const history = History.find().populate({ path: "history", populate: { path: "group" } });
  return history;
};

exports.resetAllMembersWasDriverFieldFalse = async () => {
  const updatedMembersResult = await Member.updateMany({}, { wasDriver: false });
  return updatedMembersResult;
};
