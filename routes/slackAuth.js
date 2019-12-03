const express = require("express");
const router = express.Router();

const { slackAuth } = require("controllers/slackAuth");

router.get("/", slackAuth);

module.exports = router;
