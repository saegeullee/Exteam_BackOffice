const express = require("express");
const groupMealController = require("controllers/groupMeal");
const router = express.Router();

router.get("/", groupMealController.getGroupMeals).post("/", groupMealController.saveGroupMealHistory);
router.get("/history", groupMealController.getLastGroupMealHistory);
// router.get("/reset_wasdriver", groupMealController.resetAllMembersWasDriverFieldFalse);
router.get("/test", groupMealController.testMongoose);

module.exports = router;
