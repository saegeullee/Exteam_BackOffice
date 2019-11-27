const express = require("express");
const router = express.Router();

const memberControllers = require("controllers/member");

router.get("/", memberControllers.memberList);
router.post("/", memberControllers.addMember);

module.exports = router;
