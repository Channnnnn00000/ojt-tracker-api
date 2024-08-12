const User = require("../models/User.Model");
const HTE = require('../models/HTE.Model')
const Intern = require("../models/Intern.Model");
const InternVacancy = require("../models/InternVacancy.Model");
const InternApplication = require("../models/InternApplication.Model");
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
    const profileData = await Intern.findOne({ _id: userData.profile });
    // .populate("appliedInternships")
    // .exec();
    console.log(profileData);
    return profileData;
  }
  // async getVacancy() {
  //   return await InternVacancy.find({ slots: { $gte: 1 } }).populate('hteId').exec();
  // }
  async getVacancy() {
    const allVacancyListed = await InternVacancy.find({slots: {$gte: 1}}).populate('hte').exec()
   return allVacancyListed;
  }
  async getSingleVacancy(jobId) {
    return await InternVacancy.find({ _id: jobId }).exec();
  }
  async getInternApplicationList(id) {
    let applicationArr = []
    const userInfo =  await User.findById(id)
    const applicationInfo = await InternApplication.find({ internId: userInfo.profile });
    const results = await Promise.all(applicationInfo.map(async (element) => {
      const jobInfo = await InternVacancy.findOne({ _id: element.internVacancy });
      const hteInfo = await HTE.findOne({_id: jobInfo.hte})

      const applicationObj = {
          applicationId: element._id,
          hteId: element.hteId,
          DateApplied: element.createdAt,
          jobTitle: jobInfo.title,
          status: element.status,
          company: hteInfo.name,
          isUpdated: element.isUpdated
      };
      return applicationObj;
  }));

  applicationArr.push(...results);

  console.log(applicationArr);
  return applicationArr;
    
  }
  async applyInternship(userId, jobId, payload) {
    console.log(payload);
    
    const userData = await User.findOne({_id: userId})
    const internData = await Intern.findOne({_id: userData.profile.toString()})
    const vacancyData = await InternVacancy.findById({ _id: jobId });
    const applicationData = await InternApplication.find({internId: internData.id, internVacancy: jobId}).exec()
    if(applicationData.length) {
      return {
            ErrorMessage: 'Duplicate application'
          };
    }
        // New object to save in InternApplication Collection
        if(payload.length >= 2) {
          const newApplication = new InternApplication({
            hteId: vacancyData.hte,
            internId: userData.profile,
            internVacancy: jobId,
            resumePath: 'http://localhost:4000/img/' + payload[0].filename,
            resumeFile: payload[0].filename,
            moaPath: 'http://localhost:4000/img/' + payload[1].filename,
            moaFile: payload[1].filename,
      
          });
          await newApplication.save();
          vacancyData.applicants.push(newApplication._id);
          internData.appliedInternships.push(newApplication._id)
          await vacancyData.save();
          await internData.save();
          return {
            message: 'Application sent'
          }
      
        } else {
          const newApplication = new InternApplication({
            hteId: vacancyData.hte,
            internId: userData.profile,
            internVacancy: jobId,
            resumePath: 'http://localhost:4000/img/' + payload[0].filename,
            resumeFile: payload[0].filename,

          });
          await newApplication.save();
          vacancyData.applicants.push(newApplication._id);
          internData.appliedInternships.push(newApplication._id)
          await vacancyData.save();
          await internData.save();
          return {
            message: 'Application sent'
          }
        }
  }
  async applyReset (userId) {
    const userData = await User.findOne({ _id: userId }).exec();
    const appInfo = await InternApplication.find({internId: userData.profile.toString()})
    console.log(appInfo);
    appInfo.map(async element => {
      await InternApplication.updateOne(
        {_id: element.id},
        {$set: { isUpdated: false}}
      )
    })
  }
  async acceptHteOffer(applicationId) {
    const updatedData = await InternApplication.updateOne({_id: applicationId},{$set: {status: 'Accepted'}})
    return updatedData;
  }
}

module.exports = new InternService();
