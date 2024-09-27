const mongoose = require("mongoose");

const hteSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    default: null,
  },
  brgy: {
    type: String,
    default: null,
  },
  municipality: {
    type: String,
    default: null,
  },
  province: {
    type: String,
    default: null,
  },
  location: {
    type: {
      lat: { type: Number },
      lng: { type: Number },
    },
    default: null,
  },
  hasMoa: {
    type: String,
    default: "false",
  },
  moaAttachement: {
    type: String,
    default: null,
  },
  internVacancy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InternVacancy",
    },
  ],
  evaluationResults: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Evaluation",
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

const HTE = mongoose.model("HTE", hteSchema);
module.exports = HTE;
