const mongoose = require("mongoose");

const internSchema = new mongoose.Schema({
  // Format userid + @dhvsu.edu.ph
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
    default: "intern",
  },
  middlename: {
    type: String,
    required: true,
    default: "intern",
  },
  lastname: {
    type: String,
    required: true,
    default: "intern",
  },
  email: {
    type: String,
    required: true,
    default: "intern",
  },
  age: {
    type: Number,
    required: true,
    default: 20,
  },

  sex: {
    type: String,
    required: true,
    default: "Male",
  },

  birthday: {
    type: String,
    required: true,
    default: "intern",
  },
  contactNumber: {
    type: Number,
    required: true,
    default: 12345,
  },
  province: {
    type: String,
    required: true,
    default: "intern",
  },
  municipality: {
    type: String,
    required: true,
    default: "intern",
  },
  province: {
    type: String,
    required: true,
    default: "intern",
  },
  // applicationList: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Application",
  //   },
  // ],
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

const Intern = mongoose.model("Intern", internSchema);
module.exports = Intern;
