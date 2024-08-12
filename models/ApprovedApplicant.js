const mongoose = require("mongoose");

const approvedApplicantSchema = new mongoose.Schema({
  applicationId: 
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
  },

  jobId:     {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InternVacancy",
  },
  internId: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Intern",
    },
  
  hteId: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Intern",
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

const ApprovedApplicant = mongoose.model(
  "ApprovedApplicant",
  approvedApplicantSchema
);
module.exports = ApprovedApplicant;
