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
          const existingCell = await Cell.findOne({ name: data["소속"] });

          const cell = existingCell
            ? existingCell
            : await new Cell({
                name: data["소속"]
              }).save();

          await new Member({
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
