const mongoose = require("mongoose");

const coordinatorSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
    required: true,
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
  //   default: "Coor@coor.com",
  // },
  // birthday: {
  //   type: String,
  //   required: true,
  //   default: "Coor",
  // },
  // contactNumber: {
  //   type: Number,
  //   required: true,
  //   default: 12345,
  // },
  // province: {
  //   type: String,
  //   required: true,
  //   default: "Coor",
  // },
  // city: {
  //   type: String,
  //   required: true,
  //   default: "Coor",
  // },
  // brgy: {
  //   type: String,
  //   required: true,
  //   default: "Coor",
  // },
  // street: {
  //   type: String,
  //   required: true,
  //   default: "Coor",
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

const Coordinator = mongoose.model("Coordinator", coordinatorSchema);
module.exports = Coordinator;
