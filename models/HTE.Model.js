const mongoose = require("mongoose");

const hteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,

  },
  contactNumber: {
    type: Number,
    // required: true,
  },
  address: {
    type: String,
    default: null,
  },
  hasMoa: {
    type: String,
    default: 'false',
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
