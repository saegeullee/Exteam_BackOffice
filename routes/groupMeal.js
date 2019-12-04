const express = require("express");
const groupMealController = require("controllers/groupMeal");
const router = express.Router();

router.get("/", groupMealController.getGroupMeals).post("/", groupMealController.saveGroupMealHistory);
router.get("/history", groupMealController.getLastGroupMealHistory);

module.exports = router;
