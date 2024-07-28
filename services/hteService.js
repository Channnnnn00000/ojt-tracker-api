const InternshipVacancy = require("../models/InternVacancy.Model");
const HTE = require("../models/HTE.Model");
const User = require("../models/User.Model");
const jwtUtils = require("../utils/jwtUtils");
const bcrypt = require("bcryptjs");

class HTEService {
  async loginUser(username, password) {
    const user = await User.findOne({ username });
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? jwtUtils.generateToken(user._id) : null;
  }

  async postVacancy(id, payload) {
    const userData = await User.findOne({ _id: id }).exec();

    const newVacancy = new InternshipVacancy(payload);
    await newVacancy.save();
    const profileData = await HTE.findOne({ _id: userData.profile });

    profileData.internVacancy.push(newVacancy);
    await profileData.save();
  }
  async getPostedInternship(id) {
    const userData = await User.findOne({ _id: id }).exec();
    const profileData = await HTE.findOne({ _id: userData.profile })
      .populate("internVacancy")
      .exec();
    return profileData.internVacancy;
  }
  async updatePostVacancy(id, payload) {
    const updatedData = await InternshipVacancy.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return updatedData;
  }
  async deletePostVacancy(id) {
    return await InternshipVacancy.findByIdAndDelete(id);
  }
}

module.exports = new HTEService();
