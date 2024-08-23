const mongoose = require("mongoose");
require("dotenv").config();
mongoose
  .connect(process.env.MONGO_DB_ONLINE, {})
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.error("Error connecting to Database", err));
