require("express-async-errors");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const hteRoutes = require("./routes/hteRoutes");
const adminRoutes = require("./routes/adminRoutes");
const internRoutes = require("./routes/internRoutes");
const coorRoutes = require("./routes/coorRoutes");
const dtrRoutes = require("./routes/dtrRoutes");
const resetRoutes = require("./routes/resetPasswordRoutes");
const announceRoutes = require('./routes/announceRoutes')
const path = require("path");
require("./config/database");
const cookieParser = require("cookie-parser");
require("dotenv").config();
app.use(cookieParser());
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: ["http://localhost:5173", "https://ojtrackingsystem.vercel.app"],
    credentials: true,
  })
);
app.options("*", cors());
app.use(morgan("dev"));
// app.use("/auth", authroutes);
// app.use("/auth", useRoutes);
app.use("/api/v1/announcement", announceRoutes);
app.use("/api/v1/", resetRoutes);
app.use("/api/v1/", adminRoutes);
app.use("/api/v1/", dtrRoutes);
app.use("/api/v1/hte", hteRoutes);
app.use("/api/v1/coor", coorRoutes);
app.use("/api/v1/intern", internRoutes);

app.listen(process.env.PORT || 4000, () => {
  console.log("Server is running at port " + process.env.PORT);
});
