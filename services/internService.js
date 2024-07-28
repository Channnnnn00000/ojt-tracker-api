const User = require("../models/User.Model");
const Intern = require("../models/Intern.Model");
const InternVacancy = require("../models/InternVacancy.Model");
const internApplication = require("../models/InternApplication.Model");
const jwtUtils = require("../utils/jwtUtils");
const bcrypt = require("bcryptjs");

class InternService {
  async loginIntern(username, password) {
    const user = await User.findOne({ username });
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? jwtUtils.generateToken(user._id) : null;
  }
  async getInternInformation(id) {
    const userData = await User.findOne({ _id: id }).exec();
    const profileData = await Intern.findOne({ _id: userData.profile })
      .populate("appliedInternships")
      .exec();
    console.log(profileData);
    return profileData;
  }
  async getVacancy() {
    return await InternVacancy.find().exec();
  }
  async applyInternship(userId, jobId, payload) {
    const intern = await User.findOne({ _id: userId });
    const profileId = intern.profile;
    const profileData = await Intern.findOne({ _id: profileId });
    profileData.appliedInternships.push(jobId);
    await profileData.save();

    const newApplication = new internApplication({
      internId: userId,
      internVacancyId: jobId,
      intern_resume: payload.intern_resume,
      intern_eform: payload.intern_eform,
      moa_hte: payload.moa_hte,
      status: payload.status,
    });
    await newApplication.save();
    const vacancyData = await InternVacancy.findOne({ _id: jobId });
    vacancyData.applicants.push(userId);
    await vacancyData.save();
  }
}

module.exports = new InternService();
