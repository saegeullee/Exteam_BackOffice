const express = require("express");
const router = express.Router();

const { cellList } = require("controllers/cell");

router.get("/", cellList);

module.exports = router;
