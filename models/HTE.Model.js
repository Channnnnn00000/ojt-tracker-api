const mongoose = require("mongoose");

const hteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "ABC",
  },
  contactNumber: {
    type: Number,
    default: null,
    // required: true,
  },
  address: {
    type: String,
    default: null,
  },
  hasMoa: {
    type: Boolean,
    default: false,
  },
  moaAttachement: {
    type: String,
    default: null,
  },
  internVacancy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InternVacancy",
    },
  ],
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

hteSchema.methods.postJob = function (jobDetails) {
  const newJob = new JobVacancy({ ...jobDetails, company: this._id });
  return newJob.save().then((job) => {
    this.jobVacancies.push(job._id);
    return this.save().then(() => job);
  });
};

hteSchema.methods.getPostedJobs = function () {
  return JobVacancy.find({ company: this._id });
};

const HTE = mongoose.model("HTE", hteSchema);
module.exports = HTE;
