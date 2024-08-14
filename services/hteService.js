const InternshipVacancy = require("../models/InternVacancy.Model");
const HTE = require("../models/HTE.Model");
const User = require("../models/User.Model");
const Intern = require("../models/Intern.Model");
const InternApplication = require("../models/InternApplication.Model");

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

    newVacancy.hte = profileData._id;
    await newVacancy.save()
  }

  // Get internship you posted
  async getPostedInternship(id) {
    const userData = await User.findOne({ _id: id }).exec();
    const vacancy = await InternshipVacancy.find({hte: userData.profile})
    return vacancy;
    // const profileData = await HTE.findOne({ _id: userData.profile })
    //   .populate("internVacancy")
    //   .exec();
    // return profileData.internVacancy;
  }
  async updatePostVacancy(id, payload) {
    const updatedData = await InternshipVacancy.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return updatedData;
  }
  // Remove Internship listing
  async deletePostVacancy(id) { 
    return await InternshipVacancy.findByIdAndDelete(id);
  }

  // View only all internship application with Pending Status

    // View only all internship application 
  async getAllInternshipApplication(id) {
    let applicationArr = []
    const profileData = await User.findById({_id: id})

    const listOfApplicants = await InternApplication.find({
      hteId: profileData.profile
    });
    const results = await Promise.all(listOfApplicants.map(async (element) => {
      const internInfo = await Intern.findOne({_id: element.internId})
      const jobInfo = await InternshipVacancy.findOne({_id: element.internVacancy})

      const applicationListObj = {
        applicationId: element._id,
        jobId: element.internVacancy,
        internId: element.internId,
        hteId: element.hteId,
        title: jobInfo.title,
        applicantName: internInfo.fullName,
        department: internInfo.department,
        status: element.status,
        remarks: element.remarks
      }
      return applicationListObj;
      
    }));
    applicationArr.push(...results)
    console.log(applicationArr);
    
    return applicationArr;
  }

  async getApplicationItem(payload) {      
      const applicantInfo = await InternApplication.find({
        internId: payload.internId,
        internVacancy: payload.jobId
      })
      console.log(applicantInfo);
      
      return applicantInfo;

    }
    // View only specific internship you posted
  async getSingleInternshipApplication(id) {
    let applicationArr = []
    const applicationItem = await InternApplication.find({internVacancy: id,status:'Pending'}).populate('internId').populate('internVacancy').exec()
    // const internShipItem = await InternshipVacancy.findById({_id: id}).populate('applicants').exec();
    // console.log(applicationItem);
   const results = await Promise.all(applicationItem.map(element => {
    // console.log(element.internVacancy);
    // console.log(element._id);
    console.log(element);
    
    
    const applicantsObj = {
      internId: element.internId._id,
      applicationId: element._id.toString(),
      name: element.internId.fullName,
      department: element.internId.department,
      appliedInternships: element.internId.appliedInternships,
      jobTitle: element.internVacancy.title,
      postedOn: element.internVacancy.createdAt,
    }
    return applicantsObj
    }));
    // return internShipItem;
    applicationArr.push(...results)
    // console.log(applicationArr);
    
    return applicationArr;
  }
  // Accepting intern application
  async approvingApplication(userId, applicationId, res) {
    let newArr = []
    const application = await InternApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    const vacancyData = await InternshipVacancy.findById(
      application.internVacancy
    );

    // Put error trapping when the value of slot is 0
    console.log(application.internId);
    
    const slotsRemaining = vacancyData.slots - 1;
    await InternshipVacancy.updateOne(
      { _id: application.internVacancy },
      { $set: { slots: slotsRemaining } }
    );
    // vacancyData.acceptedApplicants.push(application.internId);
 
    vacancyData.applicants = vacancyData.applicants.filter(item => item.id === application._id);
    console.log(vacancyData.applicants);
    
    await vacancyData.save();

    // const internData = await Intern.findById(application.internId);
    // internData.acceptedInternships.push(application.internVacancy);
    // internData.approvedInternships = internData.approvedInternships.filter(item => item.id === application.internVacancy);
    // await internData.save();


    const updateResult = await InternApplication.updateOne(
      { _id: applicationId },
      { $set: { status: "Approved", remarks: "Intern's review" } }
    );
    if (updateResult.nModified === 0) {
      return res
        .status(400)
        .json({ message: "Failed to update application status" });
    }
    // const acceptedApplicant = new AcceptedApplicant({
    //   applicationId: applicationId,
    //   jobId: application.internVacancy,
    //   internId: application.internId,
    //   hteId: application.hteId,
    //   acceptedDate: new Date(),
    // });
    // await acceptedApplicant.save();
  }

  async getProfile() {
    return await HTE.find().populate('internVacancy').exec()
  }
}

module.exports = new HTEService();
