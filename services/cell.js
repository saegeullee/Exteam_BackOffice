const Cell = require("models/cell");

exports.getCellList = async () => {
  const cells = await Cell.find().select("name");

  return cells;
};

exports.makeNewCell = async name => {
  const newCell = name && (await new Cell({ name }).save());

  return newCell;
};

exports.updateCell = async (cellId, name) => {
  const updated = name && (await Cell.updateOne({ _id: cellId }, { name }));

  const newCell = updated && (await Cell.find({ _id: cellId }));

  return newCell;
};

exports.deleteCell = async cellId => {
  const toBeDeleted = await Cell.findOne({ _id: cellId }).select("name");

  await Cell.deleteOne({ _id: cellId });

  return toBeDeleted;
};
