const express = require("express");
const router = express.Router();

const {
  cellList,
  addCell,
  updateCell,
  deleteCell
} = require("controllers/cell");

router.get("/", cellList);
router.post("/", addCell);
router.post("/:cellId", updateCell);
router.delete("/:cellId", deleteCell);

module.exports = router;
