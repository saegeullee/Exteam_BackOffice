const memberServices = require("services/member");
const Member = require("models/member");

const makeError = (err, status) => {
  console.log(err);
  res.status(status).json({ error: err.message });
};

exports.memberList = async (req, res) => {
  try {
    const members = await memberServices.getMemberList();

    res.status(200).json(members);
  } catch (err) {
    makeError(err, 500);
  }
};

exports.addMember = (req, res) => {
  try {
    const { name, nickName, cell, enrolledIn } = req.body;

    const newMember = new Member({
      name,
      nickName,
      cell,
      enrolledIn
    });

    res.status(200).json({
      message: "Member Created",
      newMember
    });
  } catch (err) {
    makeError(err, 500);
  }
};

exports.updateMemberDetails = (req, res) => {};
