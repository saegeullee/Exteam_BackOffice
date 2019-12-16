const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const provisionSchema = new Schema({
  memberId: { type: Schema.Types.ObjectId, ref: 'Member' },
  givenDate: { type: Date },
  returnDate: { type: Date },
  usageType: { type: String }
});

module.exports = mongoose.model('ProvisionHistory', provisionSchema);
