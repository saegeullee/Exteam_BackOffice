const Member = require("models/member");

exports.getMemberList = () => {
  const members = Member.find();

  return members;
};
