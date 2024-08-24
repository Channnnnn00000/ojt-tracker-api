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
    type: String,
    // set: (value) => {
    //   // Ensure the date is set to midnight (00:00:00) local time
    //   let date = new Date(value);
    //   date.setHours(0, 0, 0, 0);
    //   return date;
    // },
    // get: (value) => {
    //   // Strip the time part when retrieving the date
    //   if (value) {
    //     return new Date(value).toLocaleDateString().split("T")[0];
    //   }
    //   return value;
    // },
    // default: () => {
    //   let now = new Date();
    //   now.setHours(0, 0, 0, 0);
    //   return now;
    // },
    // required: true,
    // set: function (value) {
    //   // Strip the time portion from the Date object
    //   return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    // },
  },
  timeIn: {
    type: Date,
  },
  timeInLocation: {
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  timeOut: {
    type: Date,
    default: null,
  },
  timeOutLocation: {
    type: {
      lat: { type: Number },
      lng: { type: Number },
    },
    default: null,
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

    const workStart = new Date(this.timeIn);
    workStart.setHours(8, 0, 0, 0);

    const workEnd = new Date(this.timeOut);
    workEnd.setHours(17, 0, 0, 0);

    const effectiveStart = startTime < workStart ? workStart : startTime;
    const effectiveEnd = endTime > workEnd ? workEnd : endTime;

    const totalMilliseconds = effectiveEnd - effectiveStart;
    const totalHours = totalMilliseconds / (1000 * 60 * 60);

    this.totalHours = totalHours > 0 ? totalHours : 0;
  }
  // if (this.timeOut) {
  //   console.log("timeout");

  //   // Start and end times
  //   const startTime = new Date(this.timeIn);
  //   const endTime = new Date(this.timeOut);

  //   // Define working hours for the day
  //   const workStart = new Date(this.timeIn);
  //   workStart.setHours(8, 0, 0, 0); // 8:00 AM

  //   const workEnd = new Date(this.timeIn);
  //   workEnd.setHours(17, 0, 0, 0); // 5:00 PM

  //   // Adjust the start and end times if necessary
  //   const effectiveStart = startTime < workStart ? workStart : startTime;
  //   const effectiveEnd = endTime > workEnd ? workEnd : endTime;

  //   // Calculate total hours worked within the bounds of the workday
  //   if (effectiveStart <= effectiveEnd) {
  //     const totalMilliseconds = effectiveEnd - effectiveStart;
  //     const totalHours = totalMilliseconds / (1000 * 60 * 60);

  //     this.totalHours = totalHours > 0 ? totalHours : 0;
  //   } else {
  //     this.totalHours = 0;
  //   }
  // }
  next();
});

// dtrSchema.statics.findRecordForToday = async function (internId, jobId) {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   console.log(internId);
//   console.log(jobId);
//   return await this.findOne({
//     internId: internId,
//     jobId: jobId,
//     date: today,
//   });
// };

const DailyTimeRecord = mongoose.model("DailyTimeRecord", dtrSchema);
module.exports = DailyTimeRecord;
