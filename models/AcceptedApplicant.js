const mongoose = require("mongoose");

const acceptedApplicantSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true,
  },
  applicantId: {
    type: String,
    required: true,
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
