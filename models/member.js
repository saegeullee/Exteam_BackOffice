const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const memberSchema = new Schema({
  name: String,
  nickName: String,
  cell: { type: Schema.Types.ObjectId, ref: "Cell" },
  enrolledIn: Date,
  wasDriver: { type: Boolean, default: false }
});

module.exports = mongoose.model("Member", memberSchema);
