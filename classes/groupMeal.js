const memberService = require('services/member');
const groupMealService = require('services/groupMeal');
const { shuffle } = require('lodash');
const CONSTANT = require('utils/constant');

class GroupMealsGeneratingService {
  constructor() {}

  async getGroupMeals() {
    this.members = await memberService.getMemberList();
    this.MEMBER_NUM = CONSTANT.MEMBER_NUM;
    this.TOTAL_MEMBER_NUM = this.members.length;
    this.TEAM_NUM = Math.floor(this.TOTAL_MEMBER_NUM / this.MEMBER_NUM);

    this.sortedCell = this.getSortedCell();
    const finalGroupMeals = await this.getFinalGroupMeals();
    return finalGroupMeals;
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
          const { _id, nickName, wasDriver, enrolledIn } = this.members[j];
          groupByCellMembersObj[`${sortedCell[i]}`].push({
            _id: _id,
            nickName: nickName,
            wasDriver: wasDriver,
            enrolledIn: enrolledIn
          });
        }
      }
    }

    Object.keys(groupByCellMembersObj).forEach(el => {
      groupByCellMembersObj[`${el}`] = shuffle(groupByCellMembersObj[`${el}`]);
    });

    return groupByCellMembersObj;
  }

  assignDriversToGroupMeals(groupMeals, thisTermDriversArr) {
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
      let lastGroupMealsHistoryMap = [...Array(this.TEAM_NUM)].map(() => Array(this.MEMBER_NUM + 1).fill(''));
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

  generateGroupMeals(groupByCellMembersObj) {
    let groupMeals = [...Array(this.TEAM_NUM)].map(() => Array(this.MEMBER_NUM + 1).fill(''));

    const thisTermDriversArr = this.getThisTermDrivers(groupByCellMembersObj);
    groupMeals = this.assignDriversToGroupMeals(groupMeals, thisTermDriversArr);
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
      [...Array(1000)].map(async el => {
        const groupByCellMembersObj = this.getGroupedByCellMembersObj(this.sortedCell);
        const groupMeals = this.generateGroupMeals(groupByCellMembersObj);
        return this.evaluateGeneratedGroupMeals(groupHistoryForEachMembersObj, groupMeals);
      })
    );
    let bestResult = groupMealsEvaluatedResults.find(
      el => el.totalPoint === Math.min(...groupMealsEvaluatedResults.map(el => el.totalPoint))
    );

    return this.cleanUpAndSortGroupMealsResult(bestResult.groupMeals);
  }

  cleanUpAndSortGroupMealsResult(result) {
    let finalResult = [];
    result = shuffle(result);
    for (let i = 0; i < result.length; i++) {
      finalResult.push(result[i].filter(el => el !== ''));
    }
    let resultPartial = finalResult.filter(group => group.length === this.MEMBER_NUM);
    finalResult = resultPartial.concat(finalResult.filter(group => group.length === this.MEMBER_NUM + 1));
    return finalResult;
  }

  evaluateGeneratedGroupMeals(groupHistoryForEachMembersObj, groupMeals) {
    let groupEvaluatePointsArr = [];
    for (let i = 0; i < groupMeals.length; i++) {
      let groupEvaluatePoint = 0;
      for (let j = 0; j < groupMeals[i].length; j++) {
        if (groupMeals[i][j]) {
          let membersWhoWereInSameGroup = groupHistoryForEachMembersObj[`${groupMeals[i][j]}`];
          if (membersWhoWereInSameGroup) {
            for (let k = 0; k < groupMeals[i].length; k++) {
              for (let l = 0; l < membersWhoWereInSameGroup.length; l++) {
                if (groupMeals[i][k] === membersWhoWereInSameGroup[l]) {
                  groupEvaluatePoint += 1;
                }
              }
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

  getPotentialDrivers(groupByCellMembersObj) {
    const potentialDriversArr = [];
    Object.keys(groupByCellMembersObj).forEach(key => {
      const currentCellMembersArr = groupByCellMembersObj[`${key}`];
      for (let i = 0; i < currentCellMembersArr.length; i++) {
        if (Date.now() - new Date(currentCellMembersArr[i].enrolledIn).getTime() > CONSTANT.NEW_MEMBER_STANDARD) {
          if (!currentCellMembersArr[i].wasDriver) {
            potentialDriversArr.push(currentCellMembersArr[i]);
          }
        }
      }
    });

    return potentialDriversArr;
  }

  getThisTermDrivers(groupByCellMembersObj) {
    let potentialDriversArr = this.getPotentialDrivers(groupByCellMembersObj);
    return shuffle(potentialDriversArr).slice(0, this.TEAM_NUM);
  }
}

module.exports = GroupMealsGeneratingService;
