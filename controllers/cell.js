const {
  getCellList,
  makeNewCell,
  updateCell,
  deleteCell
} = require("services/cell");

exports.cellList = async (req, res) => {
  try {
    const cells = await getCellList();

    res.status(200).json(cells);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addCell = async (req, res) => {
  try {
    const { name } = req.body;

    const newCell = await makeNewCell(name);

    newCell
      ? res.status(200).json({ message: "success", newCell })
      : res.status(400).json({ error: "Check cell name" });
  } catch (err) {
    res.status(409).json({ message: "Cell already exists" });
  }
};

exports.updateCell = async (req, res) => {
  try {
    const cellId = req.params.cellId;
    const name = req.body.name;

    const updated = await updateCell(cellId, name);

    !updated
      ? res.status(400).json({ error: "Wrong cell name" })
      : res.status(200).json({ message: "success", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCell = async (req, res) => {
  try {
    const cellId = req.params.cellId;

    const deleted = await deleteCell(cellId);

    !deleted
      ? res.status(400).json({ error: "Cell does not exist" })
      : res.status(200).json({
          message: "success",
          deleted
        });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
