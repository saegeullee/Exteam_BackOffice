const express = require('express');
const router = express.Router();

const { addItemType, getItemTypeList } = require('controllers/itemType');

router.get('/', getItemTypeList);
router.post('/', addItemType);

module.exports = router;
