const express = require('express');
const router = express.Router();

const {
  addItemType,
  getItemTypeList,
  updateItemType
} = require('controllers/itemType');

router.get('/', getItemTypeList);
router.post('/', addItemType);
router.post('/:itemTypeId', updateItemType);

module.exports = router;
