const memberServices = require("services/member");
const Member = require("models/member");
const Cell = require("models/cell");

exports.memberList = async (req, res) => {
  try {
    const members = await memberServices.getMemberList();

    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const member = await memberServices.addNewMember(req);

    res.status(200).json({
      message: "Success",
      member
    });
  } catch (err) {
    const member = err.keyValue.nickName;

    res.status(400).json({ message: `member '${member}' already exists` });
  }
};

exports.updateMemberDetails = async (req, res) => {
  try {
    const member = await memberServices.updateMember(req);

    !member
      ? res.status(400).json({ message: "Not a Member" })
      : res.status(200).json({
          message: "success",
          member
        });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
