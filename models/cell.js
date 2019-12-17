const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cellSchema = new Schema({
  name: { type: String, unique: true }
});

module.exports = mongoose.model('Cell', cellSchema);
