const mongoose = require("mongoose");

const internVacancySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  slots: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum:['Active', 'Inactive'],
    default: 'Active'
  },
  location: {
    type: String,
    required: true,
  },
  hte: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HTE',

  },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  acceptedApplicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
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

const InternVacancy = mongoose.model("InternVacancy", internVacancySchema);
module.exports = InternVacancy;
