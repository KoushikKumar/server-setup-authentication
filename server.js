const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const router = require("./router");
const dotenv = require('dotenv');
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.load();
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json({ type:'*/*' }));
router(app);

mongoose.connect(process.env.MONGO_URI, function(db) {
  const server = app.listen(process.env.PORT, function(){
      const port = server.address().port;
      console.log("listening to "+port);
  });
});