const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'csv/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

const { uploadCsv, downloadCsv } = require('controllers/csv');

router.get('/', downloadCsv);
router.post('/', upload.single('data'), uploadCsv);

module.exports = router;
