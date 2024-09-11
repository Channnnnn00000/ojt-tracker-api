const mongoose = require("mongoose");

const EvaluationSchema = new mongoose.Schema({
  hteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HTE",
  },
  internId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Intern",
  },
  department: {
    type: String,
  },
  hteName: {
    type: String,
  },
  internName: {
    type: String,
  },
  address: {
    type: String,
  },
  contactNumber: {
    type: Number,
  },
  hteEvaluator: {
    type: String,
  },
  position: {
    type: String,
  },
  startDate: {
    type: String,
  },
  endDate: {
    type: String,
  },
  numberOfHoursRendered: {
    type: String,
  },
  Q1: {
    type: Number,
  },
  Q2: {
    type: Number,
  },
  Q3: {
    type: Number,
  },
  Q4: {
    type: Number,
  },
  Q5: {
    type: Number,
  },
  Q6: {
    type: Number,
  },
  Q7: {
    type: Number,
  },
  Q8: {
    type: Number,
  },
  Q9: {
    type: Number,
  },
  Q10: {
    type: Number,
  },
  Q11: {
    type: Number,
  },
  Q12: {
    type: Number,
  },
  Q13: {
    type: Number,
  },
  Q14: {
    type: Number,
  },
  Q15: {
    type: Number,
  },
  Q16: {
    type: Number,
  },
  Q17: {
    type: Number,
  },
  Q18: {
    type: Number,
  },
  Q19: {
    type: Number,
  },
  Q20: {
    type: Number,
  },
  totalScore: {
    type: Number
  },
  
  verbalInterpretation: {
    type: String
  },

  comment: {
    type: String,
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

const Evaluation = mongoose.model(
  "Evaluation",
  EvaluationSchema
);
module.exports = Evaluation;
