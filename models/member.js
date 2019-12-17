const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
  nickName: { type: String, unique: true },
  cell: { type: Schema.Types.ObjectId, ref: 'Cell' },
  enrolledIn: { type: Date, default: new Date() },
  wasDriver: { type: Boolean, default: false }
});

module.exports = mongoose.model('Member', memberSchema);
