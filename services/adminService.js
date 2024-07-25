const HTE = require("../models/HTE.Model");
const Admin = require("../models/Admin.Model");
const Coordinator = require("../models/Coordinator.Model");
const Intern = require("../models/Intern.Model");
const jwtUtils = require("../utils/jwtUtils");
const bcrypt = require("bcryptjs");

class AdminService {
  // Authentication
  async loginAdmin(username, password) {
    console.log(username);
    const user = await Admin.findOne({ username });
    console.log(user);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? jwtUtils.generateToken(user._id) : null;
  }

  // Registering the accounts
  async registerAdmin(payload) {
    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const newAdmin = new Admin({
      username: payload.username,
      password: hashedPassword,
    });
    return await newAdmin.save();
  }
  async registerHTE(payload) {
    console.log(payload.password);
    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const newHTE = new HTE({
      username: payload.username,
      password: hashedPassword,
    });
    return await newHTE.save();
  }
  async registerCoordinator(payload) {
    console.log(payload.password);
    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const newCoor = new Coordinator({
      username: payload.username,
      password: hashedPassword,
    });
    return await newCoor.save();
  }
  async registerIntern(payload) {
    console.log(payload.password);
    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const newIntern = new Intern({
      username: payload.username + "@dhvsu.edu.ph",
      password: hashedPassword,
    });
    return await newIntern.save();
  }

  //Viewing the users
  async getAdmin() {
    return await Admin.find().exec();
  }
  async getHTE() {
    return await HTE.find().exec();
  }
  async getCoor() {
    return await Coordinator.find().exec();
  }
  async getIntern() {
    return await Intern.find().exec();
  }

  // Update Section
  async updateAdmin(id, payload) {
    const updatedData = await Admin.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return updatedData;
  }
  async updateHTE(id, payload) {
    const updatedData = await HTE.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return updatedData;
  }
  async updateCoor(id, payload) {
    const updatedData = await Coordinator.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return updatedData;
  }
  async updateIntern(id, payload) {
    const updatedData = await Intern.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return updatedData;
  }

  // Removing Users
  async removeAdmin(id) {
    return await Admin.findByIdAndDelete(id);
  }
  async removeHTE(id) {
    return await HTE.findByIdAndDelete(id);
  }
  async removeCoor(id) {
    return await Coordinator.findByIdAndDelete(id);
  }
  async removeIntern(id) {
    return await Intern.findByIdAndDelete(id);
  }
}

module.exports = new AdminService();
