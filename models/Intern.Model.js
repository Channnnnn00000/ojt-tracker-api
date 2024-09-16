const mongoose = require("mongoose");

const internSchema = new mongoose.Schema({

  department: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    default: null,
  },
  middleInitial: {
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
  age: {
    type: Number,
    
    default: null,
  },
  birthday: {
    type: String,
    
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
  zipcode: {
    type: String,
    
    default: null,
  },
  workedHours: {
    type: Number,
    default: 0,
  },
  requiredHours: {
    type: Number,
    default: 0,
  },
  isInternshipReady: {
    type: Boolean,
    default: false,
  },
  isClockIn: {
    type: Boolean,
    default: false,
  },
  currentLocation: {
    type: {
      lat: { type: Number,  },
      lng: { type: Number, },
    },
    default: null,
  },
  sessionCode: {
    type: String,
    default: null,
  },

  evaluationResults: {
    index: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Evaluation",
  },
  appliedInternships: [
    {
      index: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
  ],
  dailyTimeRecords: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DailyTimeRecord",
    },
  ],
  isEvaluationReady: {
        type: String,
    enum: ["Not Ready", "Ready", "Finished"],
    default:'Not Ready'
  },

  acceptedInternship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
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

const Intern = mongoose.model("Intern", internSchema);
module.exports = Intern;
