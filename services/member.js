const Member = require('models/member');
const Cell = require('models/cell');

exports.getMemberList = () => {
  const members = Member.find().populate('cell', 'name');

  return members;
};

exports.addNewMember = async req => {
  const { nickName, cell: name, enrolledIn } = req.body;
  const cellId = await Cell.findOne({ name });

  if (nickName && cellId && enrolledIn instanceof Date) {
    const newMember = new Member({
      nickName,
      cell: cellId,
      enrolledIn,
    }).save();

    return newMember;
  } else {
    return new Error();
  }
};

exports.updateMember = async req => {
  const memberId = req.params.memberId;
  const { nickName, cell: name, enrolledIn } = req.body;

  const cell = name ? await Cell.findOne({ name }) : null;
  const member = await Member.findOne({ _id: memberId }).populate(
    'cell',
    '_id',
  );

  const updates = {
    nickName: nickName || member.nickName,
    cell: cell ? cell._id : member.cell._id,
    enrolledIn: enrolledIn || member.enrolledIn,
  };

  await Member.updateOne({ _id: memberId }, updates);

  return Member.findOne({ _id: memberId }).populate('cell', 'name');
};

exports.deleteMember = async memberId => {
  const toBeDeleted = await Member.findOne({ _id: memberId }).populate(
    'cell',
    'name',
  );

  await Member.deleteOne({ _id: memberId });

  return toBeDeleted;
};
