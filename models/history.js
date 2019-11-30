const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historySchema = new Schema(
  {
    history: [{ type: Schema.Types.ObjectId, ref: "Group" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", historySchema);
