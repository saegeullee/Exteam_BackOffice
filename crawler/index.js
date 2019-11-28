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
      result.forEach(async data => {
        try {
          const enrolledIn = new Date(data["입사일"]);
          const existingCell = await Cell.findOne({ cell: data["소속"] });
          const cell = existingCell
            ? existingCell
            : new Cell({
                cell: data["소속"]
              }).save();

          new Member({
            nickName: data["닉네임"],
            cell: cell._id,
            enrolledIn
          }).save();
        } catch (err) {
          return err;
        }
      });
    });
};

module.exports = crawler;
