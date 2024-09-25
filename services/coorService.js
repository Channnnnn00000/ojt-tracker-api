const InternshipVacancy = require("../models/InternVacancy.Model");
const HTE = require("../models/HTE.Model");
const User = require("../models/User.Model");
const Intern = require("../models/Intern.Model");
const InternApplication = require("../models/InternApplication.Model");
const DailyTimeRecord = require("../models/DailyTimeRecord.Model");
const jwtUtils = require("../utils/jwtUtils");
const bcrypt = require("bcryptjs");
const AcceptedApplicant = require("../models/AcceptedApplicant");

const VisitRequest = require("../models/VisitRequest.Model");
const Evaluation = require("../models/Evaluation.Model");
const Coor = require("../models/Coordinator.Model");

class CoorService {
  // Get specific intern depends on the department
  async getIntern(coorId) {
    const coorData = await User.findOne({ _id: coorId });
    const coorProfile = await Coor.findOne({ _id: coorData.profile });
    const internsList = await Intern.find({
      department: coorProfile.department,
    });
    return internsList;
  }
  async sendVisitationRequest(payload) {
    const statuses = ["Pending", "Accepted", "Done"];
    // query to visit request table if theres an exisiting request that is pending
    const existingRequestData = await VisitRequest.findOne({
      hteId: payload.hteId,
      coorId: payload.coorId,
      status: { $in: statuses },
    });

    if (existingRequestData) {
      return {
        errorMessage: "Existing Request Found",
      };
    }
    const coorData = await Coor.findOne({ _id: payload.coorId });
    const requestData = new VisitRequest(payload);

    await requestData.save();

    coorData.requestList.push(requestData._id);
    await coorData.save();
    console.log(requestData);

    return requestData;
  }
  async fetchHteList() {
    const hteList = await HTE.find();
    return hteList;
  }
  async fetchHteItemList(hteId) {
    const hteList = await HTE.findOne({ _id: hteId });
    return hteList;
  }
  async fetchRequestList(coorId) {
    const profileId = await User.findOne({ _id: coorId });
    const requestList = await VisitRequest.find({ coorId: profileId.profile });
    console.log(requestList);
    return requestList;
  }
  async setRequiredHours(internId, payload) {
    console.log(internId);
    console.log(payload);

    const setHours = await Intern.updateOne(
      { _id: internId },
      {
        $set: { requiredHours: payload.hours },
      }
    );

    console.log(setHours);
    return setHours;
  }

  async getCoorEvalation(userId) {
    const userData = await User.findOne({ _id: userId }).exec();
    const coorData = await Coor.findOne({
      _id: userData.profile.toString(),
    }).exec();
    if (!coorData) {
      return {
        message: "No Available Data",
      };
    }
    const evaluationData = await Evaluation.find({
      department: coorData.department,
    }).exec();
    return evaluationData;
  }

  async removeRequest(requestId) {
    console.log(requestId);

    return await VisitRequest.findByIdAndDelete({ _id: requestId });
  }
  async doneRequest(requestId) {
    const doneRequest = await VisitRequest.updateOne(
      { _id: requestId },
      {
        $set: { status: "Done" },
      }
    );
    return doneRequest;
  }
  async getCoorEvalation(userId) {
    const userData = await User.findOne({ _id: userId }).exec();
    const coorData = await Coor.findOne({
      _id: userData.profile.toString(),
    }).exec();
    if (!coorData) {
      return {
        message: "No Available Data",
      };
    }
    const evaluationData = await Evaluation.find({
      department: coorData.department,
    }).exec();
    return evaluationData;
  }
  async updateMOA(hteId, payload) {
    console.log(payload);
    console.log(hteId);

    const updateMOA = await HTE.updateOne(
      { _id: hteId },
      {
        $set: {
          moaAttachement: "https://ojttracker.site/img/" + payload.filename,
          //  moaAttachement: "http://localhost:4000/img/" + payload.filename,
          hasMoa: payload.filename,
        },
      }
    );
    return updateMOA;
  }
  async getInternsEvaluated(coorId) {
    const coorData = await User.findOne({ _id: coorId })
      .populate("profile")
      .exec();
    const internEvaluation = await Evaluation.find({
      department: coorData.profile.department,
    });

    return internEvaluation;
  }
  async updateCoorInformation(userId, payload) {
    const userData = await User.findOne({ _id: userId });
    const userDataUpdated = await User.updateOne(
      { _id: userId },
      {
        $set: {
          email: payload.email,
        },
      }
    );
    console.log('====================================');
    console.log(userData);
    console.log('====================================');
    const internData = await Coor.updateOne(
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

module.exports = new CoorService();
