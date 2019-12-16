const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'Member', default: null },
    itemType: { type: Schema.Types.ObjectId, ref: 'ItemType', required: true },
    model: { type: Schema.Types.ObjectId, ref: 'ItemModel', required: true },
    uniqueNumber: { type: Number, required: true },
    acquiredDate: { type: Date, default: null },
    price: { type: Number, required: true },
    tags: [{ type: String }],
    isArchived: { type: Boolean, default: false },
    provisionHistories: [{ type: Schema.Types.ObjectId, ref: 'Provision' }],
    memo: { type: String },
    usageType: {
      type: String,
      default: '재고',
      enum: {
        values: ['대여', '지급', '재고']
      }
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

itemSchema.virtual('uniqueNumberForClient').get(function() {
  const numberStr = '' + this.uniqueNumber;
  return ('00000' + numberStr).substring(numberStr.length);
});

module.exports = mongoose.model('Item', itemSchema);
