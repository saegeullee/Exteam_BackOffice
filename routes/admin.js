const express = require("express");
const router = express.Router();

const { adminList, newAdmin, deletion } = require("controllers/admin");

router.get("/", adminList);
router.post("/", newAdmin);
router.delete("/:adminId", deletion);

module.exports = router;
