const express = require('express');
const router = express.Router();

const {
  addItemType,
  getItemTypeList,
  updateItemType,
  deleteItemType
} = require('controllers/itemType');

router.get('/', getItemTypeList);
router.post('/', addItemType);
router.post('/:itemTypeId', updateItemType);
router.delete('/:itemTypeId', deleteItemType);

module.exports = router;
