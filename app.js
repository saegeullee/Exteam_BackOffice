const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const router = require('routes');
const crawler = require('crawler');
dotenv.config();

app.use(cors());
app.options('*', cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
router(app);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => {
    console.log('DB Connected to ' + process.env.MONGO_URI);
    // crawler();
  })
  .catch(err => {
    console.log('DB Connection Error' + err.message);
  });
mongoose.Promise = global.Promise;

module.exports = app;
