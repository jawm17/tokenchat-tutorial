const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const router = require("./routes");
const User = require('./models/User.js');
const cookieParser = require('cookie-parser');
const ws = require('ws');
require('dotenv').config();
require('./passport');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  credentials: true,
  origin: ['http://localhost:5173', 'https://tokenchat.app', 'https://www.tokenchat.app'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(router);

app.get('/api/test', (req,res) => {
  res.json('test ok');
});

mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_DEV);

const server = app.listen(PORT, function () {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
