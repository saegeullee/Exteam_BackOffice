const CONSTANT = require('./constant');

exports.getFormattedUniqueNumber = uniqueNumber => {
  const numberStr = '' + uniqueNumber;
  return (CONSTANT.ITEM_UNIQUE_NUMBER_TOTAL_LENGTH + numberStr).substring(numberStr.length);
};
