const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemTypeSchema = new Schema({
  name: { type: String, unique: true },
  models: [{ type: Schema.Types.ObjectId, ref: 'ItemModel' }],
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('ItemType', itemTypeSchema);
