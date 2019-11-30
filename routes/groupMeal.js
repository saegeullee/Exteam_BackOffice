const express = require("express");
const groupMealController = require("controllers/groupMeal");
const router = express.Router();

router.get("/", groupMealController.getGroupMeals);
router
  .get("/history", groupMealController.getGroupMealsHistory)
  .post("/history", groupMealController.saveGroupMealHistory);
router.get("/test", groupMealController.testMongoose);

module.exports = router;
