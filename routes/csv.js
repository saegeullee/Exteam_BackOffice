const express = require('express');
const router = express.Router();

const { uploadCsv } = require('controllers/csv');

router.post('/', uploadCsv);

module.exports = router;
