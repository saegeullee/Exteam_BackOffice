const Member = require("models/member");
const Group = require("models/group");
const History = require("models/history");
const { shuffle } = require("lodash");
const memberService = require("services/member");
const groupMealService = require("services/groupMeal");

class GroupMealsGeneratingService {
  constructor() {}

  async generateGroupMeals() {
    this.members = await this.getMembers();
    this.MEMBER_NUM = 4;
    this.TOTAL_PEOPLE_NUM = this.members.length;
    this.TEAM_NUM = this.TOTAL_PEOPLE_NUM / this.MEMBER_NUM;

    const sortedCell = this.getSortedCell();
    const groupByCellMembersObj = this.getGroupedByCellMembersObj(sortedCell);
    const generatedGroupMeals = await this.generateGroupMealsObj(groupByCellMembersObj);
    return generatedGroupMeals;
  }

  async getMembers() {
    return await memberService.getMemberList();
  }

  getSortedCell() {
    let numOfMemberInEachCell = {};
    for (let i = 0; i < this.members.length; i++) {
      let cellName = this.members[i].cell.cell;
      if (numOfMemberInEachCell[`${cellName}`]) {
        numOfMemberInEachCell[`${cellName}`] += 1;
      } else {
        numOfMemberInEachCell[`${cellName}`] = 1;
      }
    }

    // console.log("=======numOfMemberInEachCell========");
    // console.log(numOfMemberInEachCell);

    let sortedCell = Object.keys(numOfMemberInEachCell).sort(
      (a, b) => numOfMemberInEachCell[b] - numOfMemberInEachCell[a]
    );

    return sortedCell;
  }

  getGroupedByCellMembersObj(sortedCell) {
    const groupByCellMembersObj = {};
    for (let i = 0; i < sortedCell.length; i++) {
      for (let j = 0; j < this.members.length; j++) {
        if (sortedCell[i] === this.members[j].cell.cell) {
          if (!groupByCellMembersObj[`${sortedCell[i]}`]) {
            groupByCellMembersObj[`${sortedCell[i]}`] = [];
          }
          groupByCellMembersObj[`${sortedCell[i]}`].push({
            _id: this.members[j]._id,
            nickName: this.members[j].nickName,
            wasDriver: this.members[j].wasDriver,
            enrolledIn: this.members[j].enrolledIn
          });
        }
      }
    }

    Object.keys(groupByCellMembersObj).forEach(el => {
      groupByCellMembersObj[`${el}`] = shuffle(groupByCellMembersObj[`${el}`]);
    });

    return groupByCellMembersObj;
  }

  async updateDriversStateInDB(drivers) {
    console.log("========updateDriversStateInDB=========");
    // console.log(drivers);
    const driversIds = [];
    for (let i = 0; i < drivers.length; i++) {
      driversIds.push(drivers[i]._id);
    }
    const updatedMembers = await Member.updateMany(
      { _id: { $in: driversIds } },
      { $set: { wasDriver: true } },
      { multi: true }
    );
    console.log(updatedMembers);
  }

  async assignDriversToGroupMeals(groupMeals, thisTermDriversArr) {
    for (let i = 0; i < thisTermDriversArr.length; i++) {
      groupMeals[i][0] = thisTermDriversArr[i].nickName;
    }

    await this.updateDriversStateInDB(thisTermDriversArr);

    return groupMeals;
  }

  removeDriversFromCellMembersObj(groupByCellMembersObj, thisTermDriversArr) {
    Object.keys(groupByCellMembersObj).forEach(key => {
      const indicesToRemove = [];
      for (let i = 0; i < groupByCellMembersObj[`${key}`].length; i++) {
        for (let j = 0; j < thisTermDriversArr.length; j++) {
          if (groupByCellMembersObj[`${key}`][i].nickName === thisTermDriversArr[j].nickName) {
            indicesToRemove.push(i);
          }
        }
      }
      if (indicesToRemove.length != 0) {
        for (let k = indicesToRemove.length - 1; k > -1; k--) {
          groupByCellMembersObj[`${key}`].splice(indicesToRemove[k], 1);
        }
      }
    });

    return groupByCellMembersObj;
  }

  testingEntireSumOfObj(groupByCellMembersObj) {
    let sum = 0;
    Object.keys(groupByCellMembersObj).forEach(key => {
      sum += groupByCellMembersObj[`${key}`].length;
    });

    return sum;
  }

  async generateGroupMealsObj(groupByCellMembersObj) {
    console.log("=========generateGroupMealsObj=========");
    let groupMeals = [...Array(this.TEAM_NUM)].map(() => Array(this.MEMBER_NUM + 1).fill(""));

    let sortedCell = Object.keys(groupByCellMembersObj);

    const thisTermDriversArr = this.getThisTermDrivers(groupByCellMembersObj);
    console.log("generateGroupMealsObj - thisTermDriversArr");
    console.log(thisTermDriversArr);
    groupMeals = await this.assignDriversToGroupMeals(groupMeals, thisTermDriversArr);
    console.log("generateGroupMealsObj - groupMeals");
    console.log(groupMeals);
    groupByCellMembersObj = this.removeDriversFromCellMembersObj(groupByCellMembersObj, thisTermDriversArr);
    console.log("generateGroupMealsObj - groupByCellMembersObj");

    console.log(groupByCellMembersObj);
    // console.log(this.testingEntireSumOfObj(groupByCellMembersObj));
    // console.log(groupMeals);
    console.log("generateGroupMealsObj - sortedCell");
    console.log(sortedCell);
    console.log(sortedCell.length);

    let currentRow = 1;
    let currentColumn = 0;
    let cellIdx = 0;
    while (cellIdx !== sortedCell.length) {
      // console.log(cellIdx);
      for (let i = currentColumn; i < groupMeals.length; i++) {
        // console.log(i);
        let targetName = groupByCellMembersObj[`${sortedCell[cellIdx]}`].shift();
        if (targetName) {
          targetName = targetName.nickName;
          groupMeals[i][currentRow] = targetName;
          if (i === groupMeals.length - 1) {
            currentRow += 1;
            currentColumn = 0;
            break;
          }
        } else {
          currentColumn = i;
          cellIdx += 1;
          break;
        }
      }
    }

    console.log(groupMeals);

    const groupMealsObj = {
      groupMeals
    };

    /**
     * saving history
     */
    // await this.saveGroupMealHistory(groupMealsObj.groupMeals);
    return groupMealsObj;
  }

  getPotentialDrivers(groupByCellMembersObj) {
    const potentialDriversArr = [];
    Object.keys(groupByCellMembersObj).forEach(key => {
      const currentCellMembersArr = groupByCellMembersObj[`${key}`];
      for (let i = 0; i < currentCellMembersArr.length; i++) {
        if (Date.now() - new Date(currentCellMembersArr[i].enrolledIn).getTime() > 1000 * 60 * 60 * 24 * 14) {
          if (!currentCellMembersArr[i].wasDriver) {
            potentialDriversArr.push(currentCellMembersArr[i]);
          }
        }
      }
    });

    console.log("=======getPotentialDrivers======");
    console.log(potentialDriversArr.length);

    // if (potentialDriversArr.length < this.TEAM_NUM) {
    //   console.log("======getPotentialDrivers inside if========");
    //   const resetResult = await groupMealService.resetAllMembersWasDriverFieldFalse();
    //   if (resetResult.ok === 1) {
    //     console.log("successfully updated all members wasdriver field false");
    //     this.generateGroupMeals();
    //   }
    // }

    return potentialDriversArr;
  }

  getThisTermDrivers(groupByCellMembersObj) {
    let potentialDriversArr = this.getPotentialDrivers(groupByCellMembersObj);
    return shuffle(potentialDriversArr).slice(0, this.TEAM_NUM);
  }

  async saveGroupMealHistory(groupMeals) {
    const groupIds = [];
    for (let i = 0; i < groupMeals.length; i++) {
      const memberIds = [];
      for (let j = 0; j < groupMeals[i].length; j++) {
        const member = await Member.findOne({ nickName: groupMeals[i][j] });
        if (member) {
          memberIds.push(member._id);
          console.log(member);
        }
      }
      console.log(memberIds);
      const group = await Group.create({ group: memberIds });
      groupIds.push(group._id);
    }
    const history = await History.create({ history: groupIds });
    console.log(history);
  }
}

module.exports = GroupMealsGeneratingService;
