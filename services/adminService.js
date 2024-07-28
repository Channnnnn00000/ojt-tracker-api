const HTE = require("../models/HTE.Model");
const Admin = require("../models/Admin.Model");
const Coordinator = require("../models/Coordinator.Model");
const User = require("../models/User.Model");
const Intern = require("../models/Intern.Model");
const jwtUtils = require("../utils/jwtUtils");
const bcrypt = require("bcryptjs");

class AdminService {
  // Authentication
  async loginAdmin(username, password) {
    const user = await User.findOne({ username });
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? jwtUtils.generateToken(user._id) : null;
  }

  // Registering the accounts
  async registerAdmin(payload) {
    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const newUser = new User({
      username: payload.username,
      password: hashedPassword,
      email: payload.email,
      role: payload.role,
      profile: new Admin({
        firstname: payload.firstname,
        middlename: payload.middlename,
        lastname: payload.lastname,
      }),
    });
    await newUser.save();
  }
  async registerHTE(payload) {
    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const newUser = new User({
      username: payload.username,
      password: hashedPassword,
      email: payload.email,
      role: payload.role,
    });
    await newUser.save();

    const profile = new HTE({
      name: payload.companyName,
      contact: payload.contactNumber,
      address: payload.address,
      hasMoa: payload.hasMoa,
      moaAttachement: payload.moaAttachement,
    });
    await profile.save();

    newUser.profile = profile._id;
    await newUser.save();
  }
  async registerCoordinator(payload) {
    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const newUser = new User({
      username: payload.username,
      password: hashedPassword,
      email: payload.email,
      role: payload.role,
      profile: new Coordinator({
        assignedCourse: payload.assignedCourse,
        firstname: payload.firstname,
        middlename: payload.middlename,
        lastname: payload.lastname,
        contact: payload.contactNumber,
        address: payload.address,
      }),
    });
    await newUser.save();
  }
  async registerIntern(payload) {
    console.log(payload.password);
    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const newUser = new User({
      username: payload.username + "@dhvsu.edu.ph",
      password: hashedPassword,
      email: payload.email,
      role: payload.role,
    });
    await newUser.save();
    const internProfile = new Intern({
      fullName: payload.fullName,
      resume: payload.resume,
    });
    await internProfile.save();

    newUser.profile = internProfile._id;
    await newUser.save();
  }

  //Viewing the users

  async getAllUsers() {
    return await User.find().exec();
  }

  async getAdmin() {
    return await User.find({ role: "admin" }).exec();
  }
  async getHTE() {
    return await User.find({ role: "hte" }).exec();
  }
  async getCoor() {
    return await User.find({ role: "coordinator" }).exec();
  }
  async getIntern() {
    return await User.find({ role: "intern" }).exec();
  }

  // Update Section
  async updateAdmin(id, payload) {
    const updatedData = await User.findByIdAndUpdate(id, payload, {
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
