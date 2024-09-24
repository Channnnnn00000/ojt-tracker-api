const HTE = require("../models/HTE.Model");
const Admin = require("../models/Admin.Model");
const Coordinator = require("../models/Coordinator.Model");
const User = require("../models/User.Model");
const Intern = require("../models/Intern.Model");
const DepartmentList = require("../models/Department.Model");
const DailyTimeRecord = require("../models/DailyTimeRecord.Model.js");
const InternVacancy = require("../models/InternVacancy.Model.js");
const jwtUtils = require("../utils/jwtUtils");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const Evaluation = require("../models/Evaluation.Model");
const Application = require("../models/InternApplication.Model.js");
const VisitRequest = require("../models/VisitRequest.Model.js");
const Conversation = require("../models/Conversation.js");
const sendEmail = require("../utils/email/sendEmail");

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
    const userInfo = await User.findOne({ _id: id }).populate("profile").exec();
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
    const getCurrentUser = await User.findOne({
      username: newUser.username,
    });

    if (getCurrentUser.conversation.length < 1) {
      const NewConversation = new Conversation({});

      await NewConversation.save();

      getCurrentUser.conversation.push(NewConversation);

      await getCurrentUser.save();
    }

    const profileAdmin = new Admin({
      firstName: payload.firstName,
      lastName: payload.lastName,
    });

    await profileAdmin.save();

    newUser.profile = profileAdmin._id;
    await newUser.save();
  }
  async registerHTE(payload) {
    console.log(payload);

    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const newUser = new User({
      username: payload.username,
      password: hashedPassword,
      email: payload.email,
      role: payload.role,
    });
    await newUser.save();
    const getCurrentUser = await User.findOne({
      username: newUser.username,
    });

    if (getCurrentUser.conversation.length < 1) {
      const NewConversation = new Conversation({});

      await NewConversation.save();

      getCurrentUser.conversation.push(NewConversation);

      await getCurrentUser.save();
    }

    const profile = new HTE({
      fullName: payload.fullName,
      contactNumber: payload.contact,
      street: payload.street,
      brgy: payload.brgy,
      municipality: payload.municipality,
      province: payload.province,
      location: payload.mapLocation,
      // hasMoa: payload.hasMoa,
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
    });
    await newUser.save();
    const getCurrentUser = await User.findOne({
      username: newUser.username,
    });

    if (getCurrentUser.conversation.length < 1) {
      const NewConversation = new Conversation({});

      await NewConversation.save();

      getCurrentUser.conversation.push(NewConversation);

      await getCurrentUser.save();
    }

    const newCoor = new Coordinator({
      firstName: payload.firstName,
      lastName: payload.lastName,
      contact: payload.contactNumber,
      department: payload.department,
      street: payload.street,
      brgy: payload.brgy,
      municipality: payload.municipality,
      province: payload.province,
    });
    await newCoor.save();
    newUser.profile = newCoor._id;
    await newUser.save();
  }
  async registerIntern(payload) {
    await sendEmail(
      payload.email,
      "Internship Credentials",
      {
        // fullName:payload.fullName,
        username: payload.username,
        password: payload.password,
      },
      "./template/userCredentials.handlebars"
    );
    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const newUser = new User({
      username: payload.username,
      password: hashedPassword,
      email: payload.email,
      role: payload.role,
    });
    await newUser.save();
    const getCurrentUser = await User.findOne({
      username: newUser.username,
    });

    if (getCurrentUser.conversation.length < 1) {
      const NewConversation = new Conversation({});

      await NewConversation.save();

      getCurrentUser.conversation.push(NewConversation);

      await getCurrentUser.save();
    }
    const internProfile = new Intern({
      // fullName: payload.fullName,
      firstName: payload.firstName,
      lastName: payload.lastName,
      department: payload.department,
    });
    await internProfile.save();

    newUser.profile = internProfile._id;
    await newUser.save();
  }

  //Viewing the users

  async getAllUsers() {
    const response = await User.find().populate("profile").exec();
    return response;
  }

  async getAdmin() {
    return await User.find({ role: "Admin" }).populate("profile").exec();
  }
  async getHTE() {
    return await User.find({ role: "HTE" }).populate("profile").exec();
  }
  async getCoor() {
    return await User.find({ role: "Coordinator" }).exec();
  }
  async getIntern() {
    return await User.find({ role: "Intern" }).populate("profile").exec();
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
  async removeAccount(id) {
    const profileData = await User.findOne({ _id: id });
    if (profileData.role === "Coordinator") {
      await User.findByIdAndDelete(profileData._id);
      await Coordinator.findByIdAndDelete(profileData.profile);
      return {
        message: "Succesfully Deleted",
      };
    }
    if (profileData.role === "Intern") {
      await User.findByIdAndDelete(profileData._id);
      await Intern.findByIdAndDelete(profileData.profile);
      return {
        message: "Succesfully Deleted",
      };
    }
    if (profileData.role === "HTE") {
      await User.findByIdAndDelete(profileData._id);
      await HTE.findByIdAndDelete(profileData.profile);
      return {
        message: "Succesfully Deleted",
      };
    }
    if (profileData.role === "Admin") {
      await User.findByIdAndDelete(profileData._id);
      await Admin.findByIdAndDelete(profileData.profile);
      return {
        message: "Succesfully Deleted",
      };
    }
  }
  // Getting User Information for update
  async getUserInformation(id) {
    const userData = await User.findOne({ _id: id }).populate("profile");
    return userData;
  }
  // Updating the User Information Coor
  async updateUserInfo(id, payload) {
    console.log(payload);
    console.log("id to update" + id);
    const userData = await User.findOne({ _id: id });
    console.log(userData.profile);
    console.log(userData.role);

    if (userData.role === "Coordinator") {
      const updatedUser = await User.updateOne(
        { _id: id },
        {
          $set: { email: payload.email },
        }
      );
      console.log(updatedUser);

      const updatedProfile = await Coordinator.updateOne(
        { _id: userData.profile.toString() },
        {
          $set: {
            firstName: payload.firstName,
            lastName: payload.lastName,
            contact: payload.contactNumber,
            department: payload.department,
            street: payload.street,
            brgy: payload.brgy,
            municipality: payload.municipality,
            province: payload.province,
          },
        }
      );
    }
    if (userData.role === "HTE") {
      const updatedUser = await User.updateOne(
        { _id: id },
        {
          $set: { email: payload.email },
        }
      );
      console.log(updatedUser);

      const updatedProfile = await HTE.updateOne(
        { _id: userData.profile.toString() },
        {
          $set: {
            fullName: payload.name,
            street: payload.street,
            brgy: payload.brgy,
            municipality: payload.municipality,
            province: payload.province,
            contactNumber: payload.contactNumber,
            location: payload.location,
          },
        }
      );
      console.log(updatedProfile);
    }
    if (userData.role === "Intern") {
      const updatedUser = await User.updateOne(
        { _id: id },
        {
          $set: { email: payload.email },
        }
      );
      console.log(updatedUser);

      const updatedProfile = await Intern.updateOne(
        { _id: userData.profile.toString() },
        {
          $set: {
            firstName: payload.firstName,
            lastName: payload.lastName,
            contact: payload.contact,
            province: payload.province,
            municipality: payload.municipality,
            brgy: payload.brgy,
            street: payload.street,
            middleInitial: payload.middleInitial,
            // requiredHours: updateInfo.requiredHours,
            department: payload.department,
          },
        }
      );
      console.log(updatedProfile);
    }
    if (userData.role === "Admin") {
      const updatedUser = await User.updateOne(
        { _id: id },
        {
          $set: { email: payload.email },
        }
      );
      console.log(updatedUser);

      const updatedProfile = await Admin.updateOne(
        { _id: userData.profile.toString() },
        {
          $set: {
            firstName: payload.firstName,
            lastName: payload.lastName,
            contact: payload.contact,
            province: payload.province,
            municipality: payload.municipality,
            brgy: payload.brgy,
            street: payload.street,
          },
        }
      );
      console.log(updatedProfile);
    }
  }

  // fetching, adding, Department model to frontend
  async getDepartmentList() {
    return await DepartmentList.find();
  }
  async addDepartment(payload) {
    const newDepartment = new DepartmentList(payload);
    await newDepartment.save();
    return newDepartment;
  }
  async updateDepartment(departmentId, payload) {
    const updatedData = await DepartmentList.findByIdAndUpdate(
      departmentId,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

    return updatedData;
  }
  async deleteDepartment(departmentId) {
    const updatedData = await DepartmentList.findByIdAndDelete(departmentId);

    return updatedData;
  }

  // Fetching Intern List CRUD
  async getListOnInterns() {
    return await Intern.find();
  }
  async getDTRLogs(internId) {
    let attendanceArr = [];
    const attendanceList = await DailyTimeRecord.find({ internId: internId });
    const results = await Promise.all(
      attendanceList.map(async (element) => {
        const utcDateIn = element.timeIn;
        const utcDateOut = element.timeOut;
        const phtDateTimeIn = moment
          .utc(utcDateIn)
          .tz("Asia/Manila")
          .format("h:mm:ss A");
        const phtDateTimeOut = moment
          .utc(utcDateOut)
          .tz("Asia/Manila")
          .format("h:mm:ss A");

        const attendanceObj = {
          dtrId: element._id,
          date: element.date,
          timeIn: phtDateTimeIn,
          timeOut: phtDateTimeOut === null ? null : phtDateTimeOut,
        };
        return attendanceObj;
      })
    );
    attendanceArr.push(...results);
    return attendanceArr;
  }
  async resetInternsDevice(internId) {
    return await Intern.updateOne(
      { _id: internId },
      {
        $set: {
          sessionCode: null,
        },
      }
    );
  }
  // Fetching HTE List CRUD
  async getListOfHTE() {
    return await HTE.find();
  }
  async getInternshipsList(id) {
    return await InternVacancy.find({ hte: id });
  }
  // Fetching Coordinator
  async getListOfCoordinator() {
    return await Coordinator.find().exec();
  }

  async getAdminEvalation(userId) {
    const userData = await User.findOne({ _id: userId }).exec();
    if (userData.role !== "Admin") {
      return {
        message: "No Available Data",
      };
    }
    const evaluationData = await Evaluation.find().exec();

    return evaluationData;
  }
  async getListOfCoordinator() {
    return await Coordinator.find().exec();
  }

  // Fetching Application List
  async getListOfApplications() {
    return await Application.find().exec();
  }

  // Fetching Visit Request List
  async getListOfRequest() {
    return await VisitRequest.find().exec();
  }
  async getListOfRequest() {
    return await VisitRequest.find().exec();
  }
  async getCoorRequestList(coorId) {
    const requestCoorList = await VisitRequest.find({ coorId: coorId });
    return requestCoorList;
  }

  // Fetching Listing of HTE
  async getListOfVacancy() {
    return await InternVacancy.find().exec();
  }
  async getInternsEvaluated(internId) {
    return await Evaluation.findOne({ internId: internId });
  }
  async updateAdminInformation(userId, payload) {
    const userData = await User.findOne({ _id: userId });
    const userDataUpdated = await User.updateOne(
      { _id: userId },
      {
        $set: {
          email: payload.email,
        },
      }
    );
    console.log(userDataUpdated);
    const internData = await Admin.updateOne(
      { _id: userData.profile },
      {
        $set: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          contact: payload.contact,
          street: payload.street,
          brgy: payload.brgy,
          municipality: payload.municipality,
          province: payload.province,
        },
      }
    );
    console.log(internData);
  }
}

module.exports = new AdminService();
