const mongoose = require("mongoose");
const jwtUtils = require("../utils/jwtUtils")
const { Schema } = mongoose;

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },

  createdAt: {
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

const Department = mongoose.model("Department", departmentSchema);
module.exports = Department;
