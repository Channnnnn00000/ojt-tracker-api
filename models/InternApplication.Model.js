const mongoose = require("mongoose");

const internApplicationSchema = new mongoose.Schema({
  // Format userid + @dhvsu.edu.ph
  studentID: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
  intern_resume: {
    type: String,
  },
  endorsement_form: {
    type: String,
  },
  moa_hte: {
    type: String,
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
