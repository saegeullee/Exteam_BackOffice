const GroupMealsGeneratingService = require("classes/groupMeal");
const History = require("models/history");
const Member = require("models/member");
const Group = require("models/group");
const CONSTANT = require("utils/constant");

exports.getGroupMeals = async () => {
  const groupMeals = new GroupMealsGeneratingService();
  const groupMeal = await groupMeals.getGroupMeals();
  return groupMeal;
};
exports.getLastGroupMealHistory = async () => {
  let lastGroupMealHistory = await History.find()
    .populate({
      path: "history",
      populate: { path: "group" }
    })
    .sort("-createdAt")
    .limit(1);

  return lastGroupMealHistory;
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
  let groupMeals = [];
  if (req.body.groupMeals) {
    groupMeals = req.body.groupMeals;
  } else {
    return "NO_GROUP_MEALS";
  }

  const groupIds = [];
  const driversIds = [];
  for (let i = 0; i < groupMeals.length; i++) {
    const memberIds = [];
    for (let j = 0; j < groupMeals[i].length; j++) {
      const member = await Member.findOne({ nickName: groupMeals[i][j] });
      if (member) {
        memberIds.push(member._id);
      }
      if (j === 0) {
        driversIds.push(member._id);
      }
    }
    const group = await Group.create({ group: memberIds });
    groupIds.push(group._id);
  }

  await updateDriversStateInDB(driversIds);

  const history = await History.create({ history: groupIds });
  if (history) {
    return "success";
  }
};

updateDriversStateInDB = async driversIds => {
  const updatedMembersResult = await Member.updateMany(
    { _id: { $in: driversIds } },
    { $set: { wasDriver: true } },
    { multi: true }
  );
  if (updatedMembersResult.ok === 1) {
    console.log("successfully updated drivers state in db");
  }

  const numOfMembersWhoHaveNotDoneDrivers = await Member.find({ wasDriver: false }).count();
  const numOfNewlyJoinedMember = await Member.find({
    enrolledIn: { $gte: new Date(new Date() - CONSTANT.NEW_MEMBER_STANDARD) }
  }).count();
  const POTENTIAL_DRIVERS_NUM = numOfMembersWhoHaveNotDoneDrivers - numOfNewlyJoinedMember;
  const TOTAL_MEMBER_NUM = await Member.find().count();
  const TEAM_NUM = TOTAL_MEMBER_NUM / CONSTANT.MEMBER_NUM;

  if (TEAM_NUM > POTENTIAL_DRIVERS_NUM) {
    resetAllMembersWasDriverFieldFalse();
  }
};

resetAllMembersWasDriverFieldFalse = async () => {
  const updatedMembersResult = await Member.updateMany({}, { wasDriver: false });
  if (updatedMembersResult.ok === 1) {
    console.log("successfully updated all members wasdriver field false");
  }
};
