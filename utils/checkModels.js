exports.checkItemModel = async itemModel => {
  const Model = require('models/itemModel');
  const doesModelExist = await Model.findOne({ name: itemModel });

  if (doesModelExist) {
    return false;
  } else {
    return true;
  }
};
