const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    name: { type: String, unique: true },
    email: { type: String, unique: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Admin', adminSchema);
