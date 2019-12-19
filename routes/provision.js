const express = require('express');
const router = express.Router();
const { provideItem, getProvisionData } = require('controllers/provision');

router.get('/:itemId', getProvisionData);
router.post('/:itemId', provideItem);

module.exports = router;
