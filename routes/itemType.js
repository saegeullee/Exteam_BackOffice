const express = require('express');
const router = express.Router();

const { addItemType } = require('controllers/itemType');

router.post('/', addItemType);

module.exports = router;
