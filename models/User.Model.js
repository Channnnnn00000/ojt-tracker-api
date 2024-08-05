const mongoose = require("mongoose");
const jwtUtils = require("../utils/jwtUtils")
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["HTE", "Coordinator", "Intern", "Admin"],
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    required: true,
    default: "active",
  },
  profile: {
    // Different profiles based on the role
    type: mongoose.Schema.Types.ObjectId,
    refPath:'role'
  },
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

const User = mongoose.model("User", userSchema);
module.exports = User;
