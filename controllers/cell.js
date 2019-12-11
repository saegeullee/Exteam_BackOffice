const {
  getCellList,
  makeNewCell,
  updateCell,
  deleteCell,
} = require('services/cell');

exports.cellList = async (req, res, next) => {
  try {
    const cells = await getCellList();

    res.status(200).json(cells);
  } catch (err) {
    next(err);
  }
};

exports.addCell = async (req, res, next) => {
  try {
    const { name } = req.body;

    const newCell = await makeNewCell(name);

    if (newCell) {
      res.status(200).json({ message: 'success', newCell });
    } else {
      const err = new Error('Check cell name');
      err.statusCode = 400;
      next(err);
    }
  } catch (err) {
    err.message = 'Cell already exists';
    err.statusCode = 409;
    next(err);
  }
};

exports.updateCell = async (req, res, next) => {
  try {
    const cellId = req.params.cellId;
    const name = req.body.name;

    const updated = await updateCell(cellId, name);

    if (updated) {
      res.status(200).json({ message: 'success', updated });
    } else {
      const err = new Error('Wrong cell name');
      err.statusCode = 400;
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteCell = async (req, res, next) => {
  try {
    const cellId = req.params.cellId;

    const deleted = await deleteCell(cellId);

    if (deleted) {
      res.status(200).json({ message: 'success', deleted });
    } else {
      const err = new Error('Cell does not exist');
      err.statusCode = 400;
      next(err);
    }
  } catch (err) {
    next(err);
  }
};
