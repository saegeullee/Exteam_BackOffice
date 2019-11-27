const memberServices = require("services/member");

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

exports.addMember = async (req, res) => {
  try {
    const data = req.body.data;

    console.log(req.body);
    res.send(data);
  } catch (err) {
    makeError(err, 500);
  }
};

const memberData = {
  name: "real name",
  nickName: "my nickName",
  cell: "new Cell",
  enrolledIn: "2015. 9. 21"
};
