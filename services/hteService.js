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
const moment = require("moment-timezone");
const Evaluation = require("../models/Evaluation.Model");
const Coordinator = require("../models/Coordinator.Model");

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
    await newVacancy.save();
  }

  // Get internship you posted
  async getPostedInternship(id) {
    const userData = await User.findOne({ _id: id }).exec();
    const vacancy = await InternshipVacancy.find({ hte: userData.profile });
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

  // View only all internship application you own
  async getAllInternshipApplication(id) {
    let applicationArr = [];
    const profileData = await User.findById({ _id: id });

    const listOfApplicants = await InternApplication.find({
      hteId: profileData.profile,
    });
    console.log(listOfApplicants);

    const results = await Promise.all(
      listOfApplicants.map(async (element) => {
        const internInfo = await Intern.findOne({ _id: element.internId });
        const jobInfo = await InternshipVacancy.findOne({
          _id: element.internVacancy,
        });
        const applicationListObj = {
          applicationId: element._id,
          jobId: element.internVacancy,
          internId: element.internId,
          hteId: element.hteId,
          title: jobInfo.title,
          name: internInfo.firstName + " " + internInfo.lastName,
          department: internInfo.department,
          status: element.status,
          remarks: element.remarks,
          hoursWorked: internInfo.workedHours,
        };
        return applicationListObj;
      })
    );
    applicationArr.push(...results);
    // console.log(applicationArr);

    return applicationArr;
  }

  async getApplicationItem(payload) {
    const applicantInfo = await InternApplication.find({
      internId: payload.internId,
      internVacancy: payload.jobId,
    });
    console.log(applicantInfo);

    return applicantInfo;
  }
  // View only specific internship you posted and all the applicants
  async getSingleInternshipApplication(id) {
    let applicationArr = [];
    const applicationItem = await InternApplication.find({
      internVacancy: id,
      status: "Pending",
    })
      .populate("internId")
      .populate("internVacancy")
      .exec();
    // const internShipItem = await InternshipVacancy.findById({_id: id}).populate('applicants').exec();
    // console.log(applicationItem);
    const results = await Promise.all(
      applicationItem.map((element) => {
        // console.log(element.internVacancy);
        // console.log(element._id);
        console.log(element);

        const applicantsObj = {
          internId: element.internId._id,
          applicationId: element._id.toString(),
          fullName: `${element.internId.firstName} ${element.internId.lastName}`,
          department: element.internId.department,
          appliedInternships: element.internId.appliedInternships,
          jobTitle: element.internVacancy.title,
          postedOn: element.internVacancy.createdAt,
        };
        return applicantsObj;
      })
    );
    // return internShipItem;
    applicationArr.push(...results);
    console.log(applicationArr);

    return applicationArr;
  }
  // Accepting intern application
  async approvingApplication(userId, applicationId, res) {
    let newArr = [];
    const application = await InternApplication.findById(applicationId);
    // Check if the applicant or intern is already accepted other application offer by the hte
    const internData = await Intern.findOne({
      _id: application.internId.toString(),
    });
    console.log("====================================");
    console.log(internData.isInternshipReady);
    console.log("====================================");
    if (internData.isInternshipReady) {
      return "Intern is not available";
    }

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

    vacancyData.applicants = vacancyData.applicants.filter(
      (item) => item.id === application._id
    );
    console.log(vacancyData.applicants);

    await vacancyData.save();

    const updateResult = await InternApplication.updateOne(
      { _id: applicationId },
      { $set: { status: "Approved", remarks: "Intern's review" } }
    );
    if (updateResult.nModified === 0) {
      return res
        .status(400)
        .json({ message: "Failed to update application status" });
    }
  }

  async rejectApplication(userId, applicationId) {
    const updateResult = await InternApplication.updateOne(
      { _id: applicationId },
      { $set: { status: "Rejected" } }
    );
    if (updateResult.nModified === 0) {
      return res
        .status(400)
        .json({ message: "Failed to update application status" });
    }
  }

  async getProfile() {
    return await HTE.find().populate("internVacancy").exec();
  }
  async getInternshipAccepted(id) {
    let acceptedApplicant = [];
    const profileData = await User.findById({ _id: id });
    // To ensure you only get accepted applicants with one company
    const listOfAcceptedIntern = await AcceptedApplicant.find({
      hteId: profileData.profile,
    });
    const results = await Promise.all(
      listOfAcceptedIntern.map(async (element) => {
        console.log(element);

        const internData = await Intern.findOne({ _id: element.internId });

        const acceptedApplicantObj = {
          applicationId: element.applicationId,
          hteId: element.hteId,
          internId: element.internId,
          name: internData.firstName + " " + internData.lastName,
          department: internData.department,
          workedHours: Math.trunc(internData.workedHours),
          isClockIn: internData.isClockIn,
          dailyTimeRecords: internData.dailyTimeRecords,
          jobTitle: element.jobTitle,
          evaluationStatus: internData.isEvaluationReady,
          sessionCode: internData.sessionCode,
        };
        return acceptedApplicantObj;
      })
    );
    acceptedApplicant.push(...results);
    console.log(acceptedApplicant);
    return acceptedApplicant;
  }
  async getOnlineIntern(userId) {
    let onlineInternArr = [];
    const userData = await User.findOne({ _id: userId });
    const profileData = await HTE.findOne(userData.profile);

    let today = new Date().toLocaleDateString();
    const phDate = moment(today).tz("Asia/Manila").format("YYYY-MM-DD");

    console.log(phDate);

    const getOnlineIntern = await DailyTimeRecord.find({
      companyId: userData.profile,
      date: { $eq: today },
      timeOut: { $eq: null },
    });
    console.log(getOnlineIntern);
    const results = await Promise.all(
      getOnlineIntern.map(async (element) => {
        const internInfo = await Intern.findOne({ _id: element.internId });

        // Obj Polling intern location data
        const utcDateIn = element.timeIn;
        const phtDateTimeIn = moment
          .utc(utcDateIn)
          .tz("Asia/Manila")
          .format("h:mm:ss A");

        const onlineObj = {
          internId: internInfo._id,
          name: internInfo.firstName + " " + internInfo.lastName,
          timeIn: phtDateTimeIn,
          timeInLocation: element.timeInLocation,
          currentLocation: internInfo.currentLocation,
        };
        return onlineObj;
      })
    );
    onlineInternArr.push(...results);
    return onlineInternArr;
  }
  async getListingItem(listingId) {
    try {
      const listingData = await InternshipVacancy.findOne({ _id: listingId });
      console.log(listingData);

      return listingData;
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async updateListingItem(listingId, payload) {
    const updatedProfile = await InternshipVacancy.updateOne(
      { _id: listingId },
      {
        $set: {
          title: payload.title,
          requirements: payload.requirements,
          slots: payload.slots,
          status: payload.status,
          location: payload.location,
        },
      }
    );
    console.log(updatedProfile);
  }
  async getFetchRequest(userId) {
    const userData = await User.findOne({ _id: userId });
    return await VisitRequest.find({ hteId: userData.profile.toString() });
  }
  async acceptVisitRequest(userId, requestId) {
    const acceptResult = await VisitRequest.updateOne(
      { _id: requestId },
      { $set: { status: "Accepted" } }
    );
    return acceptResult;
  }
  async rejectVisitRequest(userId, requestId, payload) {
    const rejectResult = await VisitRequest.updateOne(
      { _id: requestId },
      { $set: { status: "Rejected", hteRemarks: payload.hteRemarks } }
    );
    return rejectResult;
  }
  async submitEvaluation(internId, payload) {
    const newEvaluation = new Evaluation(payload);
    await newEvaluation.save();
    const userDataUpdated = await Intern.updateOne(
      { _id: internId },
      {
        $set: {
          isEvaluationReady: "Finished",
        },
      }
    );
    const applicationDataUpdated = await InternApplication.updateOne(
      { internId: internId, status: "Accepted" },
      {
        $set: {
          status: "Finished",
        },
      }
    );
    console.log(applicationDataUpdated);
    console.log(userDataUpdated);
    return newEvaluation;
  }
  async getHteEvaluationItem(internId) {
    return await Evaluation.findOne({ internId: internId }).exec();
  }
  async updateHTEInformation(userId, payload) {
    console.log(userId);
    console.log(payload);

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
    const internData = await HTE.updateOne(
      { _id: userData.profile.toString() },
      {
        $set: {
          fullName: payload.name,
          contactNumber: payload.contact,
          province: payload.province,
          municipality: payload.municipality,
          brgy: payload.brgy,
          street: payload.street,
          location: payload.location,
        },
      }
    );
    console.log(internData);
  }
  async changeHtePassword(userId, payload) {
    const userData = await User.findOne({ _id: userId });
    const { oldpass, newpass } = payload;

    const isMatch = await bcrypt.compare(oldpass, userData.password);
    console.log(isMatch);
    if (!isMatch) return null;

    const hashedPassword = await bcrypt.hash(newpass, 12);
    const passwordUpdated = await User.updateOne(
      { _id: userId },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );
    return passwordUpdated;
  }
  async getInternsData(id) {
    return await Intern.findOne({ _id: id }).populate("dailyTimeRecords");
  }
  // Trigger when the intern not clock out
  async updateTimeOutData() {}
}

module.exports = new HTEService();
