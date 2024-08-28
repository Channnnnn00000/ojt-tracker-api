const InternshipVacancy = require("../models/InternVacancy.Model");
const HTE = require("../models/HTE.Model");
const User = require("../models/User.Model");
const Intern = require("../models/Intern.Model");
const InternApplication = require("../models/InternApplication.Model");
const DailyTimeRecord = require('../models/DailyTimeRecord.Model')
const jwtUtils = require("../utils/jwtUtils");
const bcrypt = require("bcryptjs");
const AcceptedApplicant = require("../models/AcceptedApplicant");
const Coor = require('../models/Coordinator.Model')
const VisitRequest = require('../models/VisitRequest.Model')

class CoorService {
  // Get specific intern depends on the department
  async getIntern(coorId) {
    const coorData = await User.findOne({_id: coorId})
    const coorProfile = await Coor.findOne({_id: coorData.profile})
    const internsList = await Intern.find({department: coorProfile.department})
    return internsList;
  }
  async sendVisitationRequest (payload) {
    const requestData = new VisitRequest(payload)
    await requestData.save()
  }
  async fetchHteList() {
    const hteList = await HTE.find()
    return hteList
  }
  async fetchRequestList(coorId) {
    const profileId = await User.findOne({_id: coorId})
    const requestList = await VisitRequest.find({coorId: profileId.profile})
    console.log(requestList)
    return requestList;

  }
 
}

module.exports = new CoorService();
