const GroupMealsGeneratingService = require("classes/groupMeal");
const History = require("models/history");
const Member = require("models/member");

exports.getGroupMeals = async () => {
  const groupMeals = new GroupMealsGeneratingService();
  const groupMeal = await groupMeals.getGroupMeals();
  return groupMeal;
};

exports.getGroupMealsHistory = async () => {
  const history = await History.find().populate({ path: "history", populate: { path: "group" } });
  return history;
};

exports.resetAllMembersWasDriverFieldFalse = async () => {
  const updatedMembersResult = await Member.updateMany({}, { wasDriver: false });
  return updatedMembersResult;
};

exports.getLastGroupMealHistories = async () => {
  let lastGroupMealHistories = await History.find({}, {}, { sort: { createdAt: -1 } })
    .populate({
      path: "history",
      populate: { path: "group" }
    })
    .limit(2);

  return lastGroupMealHistories;
};

exports.saveGroupMealHistory = async (req, res, next) => {
  let groupMeals = req.body.groupMeals;

  //should bring updateDriversStateInDB logic here

  const groupIds = [];
  for (let i = 0; i < groupMeals.length; i++) {
    const memberIds = [];
    for (let j = 0; j < groupMeals[i].length; j++) {
      const member = await Member.findOne({ nickName: groupMeals[i][j] });
      if (member) {
        memberIds.push(member._id);
      }
    }
    const group = await Group.create({ group: memberIds });
    groupIds.push(group._id);
  }
  const history = await History.create({ history: groupIds });
  if (history) {
    return "success";
  }
};
