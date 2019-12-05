const express = require('express');
const router = express.Router();

const { access, newAccess } = require('controllers/access');

router.post('/', access);
router.post('/key', newAccess);

module.exports = router;
