const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["hte", "coordinator", "intern", "admin"],
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
    type: Schema.Types.Mixed,
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
