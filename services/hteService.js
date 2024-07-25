const Internship = require("../models/Internship.Model");
const jwtUtils = require("../utils/jwtUtils");
const bcrypt = require("bcryptjs");

class HTEService {
  async postVacancy(payload) {
    const newVacancy = new Internship(payload);
    return await newVacancy.save();
  }
  async getPostedInternship() {
    return await Internship.find().exec();
  }
  async updatePostVacancy(id, payload) {
    const updatedData = await Internship.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return updatedData;
  }
  async deletePostVacancy(id) {
    return await Internship.findByIdAndDelete(id);
  }
}

module.exports = new HTEService();
