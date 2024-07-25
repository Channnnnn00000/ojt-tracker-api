const mongoose = require("mongoose");

const hteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "ABC",
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: null,
  },
  contactNumber: {
    type: Number,
    default: null,
    // required: true,
  },
  address: {
    type: String,
    default: null,
  },
  hasMoa: {
    type: Boolean,
    default: false,
  },
  moaAttachement: {
    type: String,
    default: null,
  },
  internshipList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
    },
  ],
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
