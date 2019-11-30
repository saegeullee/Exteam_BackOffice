const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema(
  {
    group: [{ type: Schema.Types.ObjectId, ref: "Member" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
