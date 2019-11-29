const memberServices = require("services/member");
const Member = require("models/member");
const Cell = require("models/cell");

exports.memberList = async (req, res) => {
  try {
    const members = await memberServices.getMemberList();

    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const member = await memberServices.addNewMember(req);

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
    const member = await memberServices.updateMember(req);

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

    const deleted = await Member.findOne({ _id: memberId }).populate(
      "cell",
      "name"
    );
    await Member.deleteOne({ _id: memberId });

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
