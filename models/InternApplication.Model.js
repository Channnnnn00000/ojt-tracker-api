const mongoose = require("mongoose");

const internApplicationSchema = new mongoose.Schema({
  // Format userid + @dhvsu.edu.ph
  hteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HTE",
  },
  internId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  internVacancy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InternVacancy",
  },
  resumePath: {
    type: String,
  },
  resumeFile: {
    type: String,
  },
  endorsementPath: {
    type: String,

  },
  eformFile: {
    type: String,

  },
  moaPath: {
    type: String,
  },
  moaFile: {
    type: String,

  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  createdAt: {
    type: String,
    default: getDateValue(),
  },
  updatedAt: {
    type: String,
    default: getDateValue(),
  },
});

function getDateValue() {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  let finaldate;

  return (finaldate = `${month} ${day}, ${year}`);
}

const Application = mongoose.model("Application", internApplicationSchema);
module.exports = Application;
