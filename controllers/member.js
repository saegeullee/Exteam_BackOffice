const Member = require("models/member");
const Cell = require("models/cell");

const {
  getMemberList,
  addNewMember,
  updateMember,
  deleteMember
} = require("services/member");

exports.memberList = async (req, res) => {
  try {
    const members = await getMemberList();

    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const member = await addNewMember(req);

    res.status(200).json({
      message: "Success",
      created: member
    });
  } catch (err) {
    const member = err.keyValue.nickName;

    res.status(400).json({ error: `member '${member}' already exists` });
  }
};

exports.updateMemberDetails = async (req, res) => {
  try {
    const member = await updateMember(req);

    !member
      ? res.status(400).json({ error: "Not a Member" })
      : res.status(200).json({
          message: "success",
          updated: member
        });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const memberId = req.params.memberId;

    const deleted = await deleteMember(memberId);

    deleted
      ? res.status(200).json({
          message: "success",
          deleted
        })
      : res.status(400).json({ error: "Member does not exist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
