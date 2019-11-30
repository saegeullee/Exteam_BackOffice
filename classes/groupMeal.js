const Member = require("models/member");
const { shuffle } = require("lodash");
const memberService = require("services/member");
const groupMealService = require("services/groupMeal");

class GroupMealsGeneratingService {
  constructor() {}

  async getGroupMeals() {
    this.members = await this.getMembers();
    this.MEMBER_NUM = 4;
    this.TOTAL_PEOPLE_NUM = this.members.length;
    this.TEAM_NUM = this.TOTAL_PEOPLE_NUM / this.MEMBER_NUM;

    this.sortedCell = this.getSortedCell();
    const finalGroupMeals = await this.getFinalGroupMeals();
    return finalGroupMeals;
  }

  async getMembers() {
    return await memberService.getMemberList();
  }

  getSortedCell() {
    let numOfMemberInEachCell = {};
    for (let i = 0; i < this.members.length; i++) {
      let cellName = this.members[i].cell.name;
      if (numOfMemberInEachCell[`${cellName}`]) {
        numOfMemberInEachCell[`${cellName}`] += 1;
      } else {
        numOfMemberInEachCell[`${cellName}`] = 1;
      }
    }

    let sortedCell = Object.keys(numOfMemberInEachCell).sort(
      (a, b) => numOfMemberInEachCell[b] - numOfMemberInEachCell[a]
    );

    return sortedCell;
  }

  getGroupedByCellMembersObj(sortedCell) {
    const groupByCellMembersObj = {};
    for (let i = 0; i < sortedCell.length; i++) {
      for (let j = 0; j < this.members.length; j++) {
        if (sortedCell[i] === this.members[j].cell.name) {
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

  //This should go to saveGroupMealHistory in groupMeal Service
  async updateDriversStateInDB(drivers) {
    const driversIds = [];
    for (let i = 0; i < drivers.length; i++) {
      driversIds.push(drivers[i]._id);
    }
    const updatedMembers = await Member.updateMany(
      { _id: { $in: driversIds } },
      { $set: { wasDriver: true } },
      { multi: true }
    );
  }

  async assignDriversToGroupMeals(groupMeals, thisTermDriversArr) {
    for (let i = 0; i < thisTermDriversArr.length; i++) {
      groupMeals[i][0] = thisTermDriversArr[i].nickName;
    }

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

  async getTotalGroupMealHistory() {
    let lastGroupMealHistories = await groupMealService.getLastGroupMealHistories();

    let totalHistoryMap = [];
    for (let i = 0; i < lastGroupMealHistories.length; i++) {
      let lastGroupMealsHistoryMap = [...Array(this.TEAM_NUM)].map(() => Array(this.MEMBER_NUM).fill(""));
      for (let j = 0; j < lastGroupMealHistories[i].history.length; j++) {
        let currentGroup = [];
        for (let k = 0; k < lastGroupMealHistories[i].history[j].group.length; k++) {
          currentGroup.push(lastGroupMealHistories[i].history[j].group[k].nickName);
        }
        lastGroupMealsHistoryMap[j] = currentGroup;
      }
      totalHistoryMap.push(lastGroupMealsHistoryMap);
    }

    return totalHistoryMap;
  }

  async generateGroupMeals(groupByCellMembersObj) {
    let groupMeals = [...Array(this.TEAM_NUM)].map(() => Array(this.MEMBER_NUM).fill(""));

    const thisTermDriversArr = await this.getThisTermDrivers(groupByCellMembersObj);
    groupMeals = await this.assignDriversToGroupMeals(groupMeals, thisTermDriversArr);
    groupByCellMembersObj = this.removeDriversFromCellMembersObj(groupByCellMembersObj, thisTermDriversArr);

    let currentRow = 1;
    let currentColumn = 0;
    let cellIdx = 0;
    while (cellIdx !== this.sortedCell.length) {
      for (let i = currentColumn; i < groupMeals.length; i++) {
        let targetMember = groupByCellMembersObj[`${this.sortedCell[cellIdx]}`].shift();
        if (targetMember) {
          targetMember = targetMember.nickName;
          groupMeals[i][currentRow] = targetMember;
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
    return groupMeals;
  }

  async getFinalGroupMeals() {
    const totalGroupMealHistory = await this.getTotalGroupMealHistory();
    const groupHistoryForEachMembersObj = this.getHistoryOfSameGroupMemberForEachMembers(totalGroupMealHistory);

    const groupMealsEvaluatedResults = await Promise.all(
      [...Array(100)].map(async el => {
        const groupByCellMembersObj = this.getGroupedByCellMembersObj(this.sortedCell);
        const groupMeals = await this.generateGroupMeals(groupByCellMembersObj);
        return this.evaluateGeneratedGroupMeals(groupHistoryForEachMembersObj, groupMeals);
      })
    );
    const bestResult = groupMealsEvaluatedResults.find(
      el => el.totalPoint === Math.min(...groupMealsEvaluatedResults.map(el => el.totalPoint))
    );
    console.log(bestResult);
    return bestResult.groupMeals;
  }

  evaluateGeneratedGroupMeals(groupHistoryForEachMembersObj, groupMeals) {
    let groupEvaluatePointsArr = [];
    for (let i = 0; i < groupMeals.length; i++) {
      let groupEvaluatePoint = 0;
      for (let j = 0; j < groupMeals[i].length; j++) {
        let membersWhoWereInSameGroup = groupHistoryForEachMembersObj[`${groupMeals[i][j]}`];
        for (let k = 0; k < groupMeals[i].length; k++) {
          for (let l = 0; l < membersWhoWereInSameGroup.length; l++) {
            if (groupMeals[i][k] === membersWhoWereInSameGroup[l]) {
              groupEvaluatePoint += 1;
            }
          }
        }
      }
      groupEvaluatePointsArr.push(groupEvaluatePoint);
    }
    const totalPoint = groupEvaluatePointsArr.reduce((prev, cur) => prev + cur);
    return {
      totalPoint,
      groupMeals
    };
  }

  getHistoryOfSameGroupMemberForEachMembers(totalGroupMealHistory) {
    let groupHistoryForEachMembersObj = {};
    for (let i = 0; i < this.members.length; i++) {
      for (let j = 0; j < totalGroupMealHistory.length; j++) {
        for (let k = 0; k < totalGroupMealHistory[j].length; k++) {
          for (let l = 0; l < totalGroupMealHistory[j][k].length; l++) {
            if (totalGroupMealHistory[j][k][l] === this.members[i].nickName) {
              if (!groupHistoryForEachMembersObj[`${this.members[i].nickName}`]) {
                groupHistoryForEachMembersObj[`${this.members[i].nickName}`] = [];
              }

              for (let m = 0; m < totalGroupMealHistory[j][k].length; m++) {
                if (totalGroupMealHistory[j][k][m] !== this.members[i].nickName) {
                  groupHistoryForEachMembersObj[`${this.members[i].nickName}`].push(totalGroupMealHistory[j][k][m]);
                }
              }
            }
          }
        }
      }
    }
    return groupHistoryForEachMembersObj;
  }

  async getPotentialDrivers(groupByCellMembersObj) {
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

    //should move this logic to groupmeals services so that it should check whenever there is a groupHistory save
    if (potentialDriversArr.length < this.TEAM_NUM) {
      const resetResult = await groupMealService.resetAllMembersWasDriverFieldFalse();
      if (resetResult.ok === 1) {
        console.log("successfully updated all members wasdriver field false");
        this.generateGroupMeals();
      }
    }

    return potentialDriversArr;
  }

  async getThisTermDrivers(groupByCellMembersObj) {
    let potentialDriversArr = await this.getPotentialDrivers(groupByCellMembersObj);
    return shuffle(potentialDriversArr).slice(0, this.TEAM_NUM);
  }
}

module.exports = GroupMealsGeneratingService;
