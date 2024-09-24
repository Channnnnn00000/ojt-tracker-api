const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: null,
  },
  lastName: {
    type: String,
    default: null,
  },
  contact: {
    type: Number,
    default: null,
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

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
