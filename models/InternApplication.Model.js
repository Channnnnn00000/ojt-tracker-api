const mongoose = require("mongoose");

const internApplicationSchema = new mongoose.Schema({
  // Format userid + @dhvsu.edu.ph
  internId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  internVacancy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InternVacancy",
  },
  intern_resume: {
    type: String,
    default: "resume link",
  },
  intern_eform: {
    type: String,
    default: "endorsement link",
  },
  moa_hte: {
    type: String,
    default: "moe link",
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
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
