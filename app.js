const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("routes");
const crawler = require("crawler");
dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
router(app);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("DB Connected to " + process.env.MONGO_URI);
    // crawler();
  })
  .catch(err => {
    console.log("DB Connection Error" + err.message);
  });
mongoose.Promise = global.Promise;

module.exports = app;
