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
  // Get information of current logged in user
  async getLoggedInUser(id) {
    const userInfo = await User.findOne({_id: id}).populate('profile').exec()
    return userInfo;

  }
  // Registering the accounts
  async registerAdmin(payload) {
    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const newUser = new User({
      username: payload.username,
      password: hashedPassword,
      email: payload.email,
      role: payload.role,
    });
    await newUser.save();

    const profileAdmin = new Admin({
      firstname: payload.firstname,
      middlename: payload.middlename,
      lastname: payload.lastname,
    });

    await profileAdmin.save();

    newUser.profile = profileAdmin._id;
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
      name: payload.name,
      contact: payload.contactNumber,
      address: payload.address,
      hasMoa: payload.hasMoa,

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
      department: payload.department
    });
    await internProfile.save();

    newUser.profile = internProfile._id;
    await newUser.save();
  }

  //Viewing the users

  async getAllUsers() {
    return await User.find().populate('profile').exec();
  }

  async getAdmin() {
    return await User.find({ role: "Admin" }).populate('profile').exec();
  }
  async getHTE() {
    return await User.find({ role: "HTE" }).populate('profile').exec();
  }
  async getCoor() {
    return await User.find({ role: "Coordinator" }).exec();
  }
  async getIntern() {
    return await User.find({ role: "Intern" }).exec();
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
