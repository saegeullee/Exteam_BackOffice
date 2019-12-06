const {
  getMemberList,
  addNewMember,
  updateMember,
  deleteMember,
} = require('services/member');

exports.memberList = async (req, res, next) => {
  try {
    const members = await getMemberList();

    res.status(200).json(members);
  } catch (err) {
    next(err);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const created = await addNewMember(req);

    if (!created instanceof Error) {
      res.status(200).json({ message: 'Success', created });
    } else {
      const err = new Error('Check member data');
      err.statusCode = 400;
      next(err);
    }
  } catch (err) {
    const member = err.keyValue.nickName;
    err.message = `Member '${member}' already exists`;
    err.statusCode = 409;
    next(err);
  }
};

exports.updateMemberDetails = async (req, res, next) => {
  try {
    const updated = await updateMember(req);

    if (member) {
      res.status(200).json({ message: 'success', updated });
    } else {
      const err = new Error('Not a member');
      err.statusCode = 400;
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteMember = async (req, res, next) => {
  try {
    const memberId = req.params.memberId;

    const deleted = await deleteMember(memberId);

    if (deleted) {
      res.status(200).json({ message: 'success', deleted });
    } else {
      const err = new Error('Member does not exist');
      err.statusCode = 400;
      next(err);
    }
  } catch (err) {
    next(err);
  }
};
