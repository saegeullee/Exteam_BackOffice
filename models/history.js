const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historySchema = new Schema(
  {
    groups: [{ type: Schema.Types.ObjectId, ref: "Member" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", historySchema);
