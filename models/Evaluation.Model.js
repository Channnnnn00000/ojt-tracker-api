const mongoose = require("mongoose");

const EvaluationSchema = new mongoose.Schema({
  hteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HTE",
  },
  internId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Intern",
  },
  department: {
    type: String,
  },
  hteName: {
    type: String,
  },
  internName: {
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

const AcceptedApplicant = mongoose.model(
  "AcceptedApplicant",
  acceptedApplicantSchema
);
module.exports = AcceptedApplicant;
