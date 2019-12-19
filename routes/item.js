const express = require('express');
const router = express.Router();
const itemController = require('controllers/item');

router.get('/', itemController.getAllItems);
router.post('/', itemController.createItem);

router.get('/iteminfo', itemController.itemInfoForNewItem);

router.get('/:id', itemController.getItem);
router.delete('/:id', itemController.deleteItem);
router.post('/:id', itemController.updateItem);

module.exports = router;
