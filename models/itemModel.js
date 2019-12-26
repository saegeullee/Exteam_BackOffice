const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemModelSchema = new Schema({
  name: { type: String, unique: true },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('ItemModel', itemModelSchema);
