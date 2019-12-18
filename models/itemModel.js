const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemModelSchema = new Schema({
  name: { type: String, unique: true }
});

module.exports = mongoose.model('ItemModel', itemModelSchema);
