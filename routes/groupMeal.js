const express = require("express");
const groupMealController = require("controllers/groupMeal");
const router = express.Router();

router.get("/", groupMealController.generateGroupMeal);
router.get("/history", groupMealController.getGroupMealsHistory);
router.get("/reset_wasdriver", groupMealController.resetAllMembersWasDriverFieldFalse);

module.exports = router;
