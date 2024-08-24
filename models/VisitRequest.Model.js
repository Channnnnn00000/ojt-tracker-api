const mongoose = require("mongoose");

const visitRequestSchema = new mongoose.Schema({
  hteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HTE",
  },
  requestorName: {
    type: String,
  },
  scheduledDate: {
    type: String,
  },
  scheduledtime: {
    type: String,
  },
  department: {
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

const VisitRequest = mongoose.model(
  "VisitRequest",
  visitRequestSchema
);
module.exports = VisitRequest;
