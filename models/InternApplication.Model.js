const mongoose = require("mongoose");

const internApplicationSchema = new mongoose.Schema({
  // Format userid + @dhvsu.edu.ph
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
  resumePath: {
    type: String,
  },
  resumeFile: {
    type: String,
  },
  parentConsentFile: {
    type: String,
  },
  parentConsentPath: {
    type: String,
  },
  internEndorsementPath: {
    type: String,
  },
  internEndorsementFile: {
    type: String,
  },
  moaPath: {
    type: String,
  },
  moaFile: {
    type: String,
  },

  firstEndorsementFormPath: {
    type: String,
  },
  firstEndorsementFormFile: {
    type: String,
  },
  certificationFormPath: {
    type: String,
  },
  certificationFormFile: {
    type: String,
  },
  internshipAgreementPath: {
    type: String,
  },
  internshipAgreementFile: {
    type: String,
  },

  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected", "Approved", "Finished"],
    default: "Pending",
  },
  remarks: {
    type: String,
    default: null,
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
