const mongoose = require("mongoose");

const dtrSchema = new mongoose.Schema({
  internId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Intern",
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HTE",
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InternVacancy",
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  timeIn: {
    type: Date,
    required: true,
  },
  timeInLocation: {
    type: {
      lat: { type: Number, required: true },
      long: { type: Number, required: true },
    },
    required: true,
  },
  timeOut: {
    type: Date,
  },
  timeOutLocation: {
    type: {
      lat: { type: Number },
      long: { type: Number },
    },
  },
  totalHours: {
    type: Number,
    default: 0,
  },
});
dtrSchema.pre("save", function (next) {
  if (this.timeOut) {
    const startTime = new Date(this.timeIn);
    const endTime = new Date(this.timeOut);

    const workStart = new Date(this.date);
    workStart.setHours(8, 0, 0, 0);

    const workEnd = new Date(this.date);
    workEnd.setHours(17, 0, 0, 0);

    const effectiveStart = startTime < workStart ? workStart : startTime;
    const effectiveEnd = endTime > workEnd ? workEnd : endTime;

    const totalMilliseconds = effectiveEnd - effectiveStart;
    const totalHours = totalMilliseconds / (1000 * 60 * 60);

    this.totalHours = totalHours > 0 ? totalHours : 0;
  }
  next();
});
function getDateValue() {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  let finaldate;

  return (finaldate = `${month} ${day}, ${year}`);
}

const DailyTimeRecord = mongoose.model("DailyTimeRecord", dtrSchema);
module.exports = DailyTimeRecord;
