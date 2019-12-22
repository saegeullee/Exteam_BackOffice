const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accessSchema = new Schema({
  key: String
});

module.exports = mongoose.model('Access', accessSchema);
