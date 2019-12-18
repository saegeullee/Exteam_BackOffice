const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const provisionSchema = new Schema({
  memberId: { type: Schema.Types.ObjectId, ref: 'Member' },
  givenDate: { type: Date },
  returnDate: { type: Date },
  usageType: {
    type: String,
    enum: {
      values: ['대여', '지급']
    }
  }
});

module.exports = mongoose.model('Provision', provisionSchema);
