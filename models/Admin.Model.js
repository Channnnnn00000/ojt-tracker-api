const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  // username: {
  //   type: String,
  //   required: true,
  // },
  // password: {
  //   type: String,
  //   required: true,
  // },
  firstname: {
    type: String,
    required: true,
    default: "Admin",
  },
  middlename: {
    type: String,
    required: true,
    default: "Admin",
  },
  lastname: {
    type: String,
    required: true,
    default: "Admin",
  },
  // sex: {
  //   type: String,
  //   required: true,
  //   default: "Male",
  // },
  // email: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   default: "Admin@admin.com",
  // },
  // birthday: {
  //   type: String,
  //   required: true,

  //   default: "Admin",
  // },
  // contactNumber: {
  //   type: Number,
  //   required: true,
  //   default: 12345,
  // },
  // province: {
  //   type: String,
  //   required: true,
  //   default: "Admin",
  // },
  // city: {
  //   type: String,
  //   required: true,
  //   default: "Admin",
  // },
  // brgy: {
  //   type: String,
  //   required: true,
  //   default: "Admin",
  // },
  // street: {
  //   type: String,
  //   required: true,
  //   default: "Admin",
  // },

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
