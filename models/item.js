const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  itemType: { type: Schema.Types.ObjectId, ref: 'ItemType', required: true },
  model: { type: Schema.Types.ObjectId, ref: 'ItemModel', required: true },
  uniqueNumber: { type: Number, required: true },
  aquiredDate: { type: Date, default: Date.now },
  price: { type: Number, required: true },
  tag: [{ type: String }],
  isArchived: { type: Boolean, default: false },
  provisionHistory: [{ type: Schema.Types.ObjectId, ref: 'Provision' }],
  memo: { type: String }
});

module.exports = mongoose.model('Item', itemSchema);
