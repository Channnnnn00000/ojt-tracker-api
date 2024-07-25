const express = require("express");
const app = express();
const morgan = require("morgan");
const hteRoutes = require("./routes/hteRoutes");
const adminRoutes = require("./routes/adminRoutes");
require("./config/database");
const cookieParser = require("cookie-parser");
require("dotenv").config();
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan("dev"));
// app.use("/auth", authroutes);
// app.use("/auth", useRoutes);
app.use("/api/v1/", hteRoutes);
app.use("/api/v1/", adminRoutes);

app.listen(process.env.PORT || 4000, () => {
  console.log("Server is running at port " + process.env.PORT);
});
