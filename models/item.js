const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  itemType: {type: Schema.Types.ObjectId, ref="ItemType"},
  uniqueNumber: {type: String},
  aquiredDate: {type: Date},
  price: {type: Number},
  tag: [{type: String}],
  isArchived: {type: Boolean, default: false},
  provisionHistory: [{type: Schema.Types.ObjectId, ref="Provision"}],
  memo: {type: String}
})

module.exports = mongoose.model("Item", itemSchema);