const Member = require("models/member");
const Cell = require("models/cell");
const csv = require("csv-parser");
const fs = require("fs");

const crawler = () => {
  const result = [];

  fs.createReadStream("crawler/groupMeal.csv")
    .pipe(csv())
    .on("data", data => result.push(data))
    .on("end", () => {
      result.forEach(data => {
        const enrollment = new Date(data["입사일"]);
        if (data["소속"].length) {
          const newCell = new Cell({
            cell: data["소속"]
          }).save();

          const newMember = new Member({
            nickName: data["닉네임"],
            cell: newCell._id,
            enrolledIn: enrollment
          }).save();
        }
      });
    });
};

module.exports = crawler;
