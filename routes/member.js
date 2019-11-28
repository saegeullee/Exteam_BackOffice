const express = require("express");
const router = express.Router();

const {
  memberList,
  addMember,
  updateMemberDetails,
  deleteMember
} = require("controllers/member");

router.get("/", memberList);
router.post("/", addMember);
router.post("/:memberId", updateMemberDetails);
router.delete("/:memberId", deleteMember);

module.exports = router;
