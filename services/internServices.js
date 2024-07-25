const Internship = require("../models/Internship.Model");
const jwtUtils = require("../utils/jwtUtils");
const bcrypt = require("bcryptjs");

class InternService {
  async postVacancy(title, description, slots, location) {
    const newVacancy = new Internship({ title, description, slots, location });
    return await newVacancy.save();
  }
  async applyInternship() {}
}

module.exports = new HTEService();
