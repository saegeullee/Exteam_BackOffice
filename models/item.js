const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueNumberFormatter = require('utils/uniqueNumberFormatter');

const itemSchema = new Schema(
  {
    provisionHistories: [{ type: Schema.Types.ObjectId, ref: 'Provision' }],
    owner: { type: Schema.Types.ObjectId, ref: 'Member', default: null },
    itemType: { type: Schema.Types.ObjectId, ref: 'ItemType', required: true },
    model: { type: Schema.Types.ObjectId, ref: 'ItemModel', required: true },
    uniqueNumber: { type: Number, required: true },
    acquiredDate: { type: Date, default: null },
    price: { type: Number, required: true },
    tags: [{ type: String }],
    isArchived: { type: Boolean, default: false },
    memo: { type: String },
    usageType: {
      type: String,
      default: '재고',
      enum: {
        values: ['대여', '지급', '재고'],
        message: 'usageType은 반드시 대여, 지급, 재고 중 하나여야 합니다.'
      }
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

itemSchema.virtual('uniqueNumberForClient').get(function() {
  return uniqueNumberFormatter.getFormattedUniqueNumber(this.uniqueNumber);
});

module.exports = mongoose.model('Item', itemSchema);
