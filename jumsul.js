const data = require("./data");

console.log(data.class101Members.length);
const class101Members = data.class101Members;
const MEMBER_NUM = 4;
const TOTAL_PEOPLE_NUM = data.class101Members.length;
const TEAM_NUM = TOTAL_PEOPLE_NUM / MEMBER_NUM;

let numOfPeopleInEachCell = {};
for (let i = 0; i < data.class101Members.length; i++) {
    let cellName = data.class101Members[i].cell;
    if (numOfPeopleInEachCell[`${cellName}`]) {
        numOfPeopleInEachCell[`${cellName}`] += 1;
    } else {
        numOfPeopleInEachCell[`${cellName}`] = 1;
    }
}

console.log("=======numOfPeopleInEachCell========");
console.log(numOfPeopleInEachCell);

let sortedCell = Object.keys(numOfPeopleInEachCell).sort((a, b) => numOfPeopleInEachCell[b] - numOfPeopleInEachCell[a]);

console.log("===========sortedCell==========");
console.log(sortedCell);

const groupByCellMembersObj = {};
for (let i = 0; i < sortedCell.length; i++) {
    for (let j = 0; j < class101Members.length; j++) {
        if (sortedCell[i] === class101Members[j].cell) {
            if (groupByCellMembersObj[`${sortedCell[i]}`]) {
                groupByCellMembersObj[`${sortedCell[i]}`].push(class101Members[j].name);
            } else {
                groupByCellMembersObj[`${sortedCell[i]}`] = [];
                groupByCellMembersObj[`${sortedCell[i]}`].push(class101Members[j].name);
            }
        }
    }
}

console.log(groupByCellMembersObj);

const groupMeals = [...Array(TEAM_NUM)].map(() => Array(MEMBER_NUM + 1).fill(""));
console.log(groupMeals);

let currentRow = 0;
sortedCell = Object.keys(groupByCellMembersObj);
console.log(sortedCell);

let currentColumn = 0;
let currentCell = 0;
while (currentCell !== sortedCell.length) {
    for (let j = currentColumn; j < groupMeals.length; j++) {
        let targetName = groupByCellMembersObj[`${sortedCell[currentCell]}`].shift();
        if (targetName) {
            groupMeals[j][currentRow] = targetName;
            if (j === groupMeals.length - 1) {
                currentRow += 1;
                currentColumn = 0;
                break;
            }
        } else {
            currentColumn = j;
            currentCell += 1;
            break;
        }
    }
}

console.log(groupByCellMembersObj);

console.log(groupMealsObj);
