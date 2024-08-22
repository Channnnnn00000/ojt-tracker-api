const mongoose = require("mongoose");

const acceptedApplicantSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
  },
  hteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HTE",
  },
  internId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Intern",
  },
  internVacancy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InternVacancy",
  },
  department: {
    type: String,
  },
  jobTitle: {
    type: String,
  },
  name: {
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
