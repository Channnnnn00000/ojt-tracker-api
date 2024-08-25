const User = require("../models/User.Model");
const HTE = require("../models/HTE.Model");
const Intern = require("../models/Intern.Model");
const InternVacancy = require("../models/InternVacancy.Model");
const InternApplication = require("../models/InternApplication.Model");
const AcceptedApplicant = require("../models/AcceptedApplicant");
const jwtUtils = require("../utils/jwtUtils");
const bcrypt = require("bcryptjs");
const DailyTimeRecord = require("../models/DailyTimeRecord.Model");

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
    return profileData;
  }
  async getVacancy() {
    const allVacancyListed = await InternVacancy.find({ slots: { $gte: 1 } })
      .populate("hte")
      .exec();
    return allVacancyListed;
  }
  async getSingleVacancy(jobId) {
    return await InternVacancy.find({ _id: jobId }).exec();
  }
  // Show application list
  async getInternApplicationList(id) {
    let applicationArr = [];
    const userInfo = await User.findById(id);
    const applicationInfo = await InternApplication.find({
      internId: userInfo.profile,
    });
    const results = await Promise.all(
      applicationInfo.map(async (element) => {
        const jobInfo = await InternVacancy.findOne({
          _id: element.internVacancy,
        });
        const hteInfo = await HTE.findOne({ _id: jobInfo.hte });

        const applicationObj = {
          applicationId: element._id,
          hteId: element.hteId,
          DateApplied: element.createdAt,
          jobTitle: jobInfo.title,
          status: element.status,
          company: hteInfo.name,
        };
        return applicationObj;
      })
    );

    applicationArr.push(...results);

    console.log(applicationArr);
    return applicationArr;
  }
  async applyInternship(userId, jobId, payload) {
    console.log(payload);

    const userData = await User.findOne({ _id: userId });
    const internData = await Intern.findOne({
      _id: userData.profile.toString(),
    });
    const vacancyData = await InternVacancy.findById({ _id: jobId });
    const applicationData = await InternApplication.find({
      internId: internData.id,
      internVacancy: jobId,
    }).exec();
    if (applicationData.length) {
      return {
        ErrorMessage: "Duplicate application",
      };
    }
    // New object to save in InternApplication Collection
    if (payload.length >= 2) {
      const newApplication = new InternApplication({
        hteId: vacancyData.hte,
        internId: userData.profile,
        internVacancy: jobId,
        resumePath: "http://localhost:4000/img/" + payload[0].filename,
        resumeFile: payload[0].filename,
        moaPath: "http://localhost:4000/img/" + payload[1].filename,
        moaFile: payload[1].filename,
      });
      await newApplication.save();
      vacancyData.applicants.push(newApplication._id);
      internData.appliedInternships.push(newApplication._id);
      await vacancyData.save();
      await internData.save();
      return {
        message: "Application sent",
      };
    } else {
      const newApplication = new InternApplication({
        hteId: vacancyData.hte,
        internId: userData.profile,
        internVacancy: jobId,
        resumePath: "http://localhost:4000/img/" + payload[0].filename,
        resumeFile: payload[0].filename,
      });
      await newApplication.save();
      vacancyData.applicants.push(newApplication._id);
      internData.appliedInternships.push(newApplication._id);
      await vacancyData.save();
      await internData.save();
      return {
        message: "Application sent",
      };
    }
  }
  async applyReset(userId) {
    const userData = await User.findOne({ _id: userId }).exec();
    const appInfo = await InternApplication.find({
      internId: userData.profile.toString(),
    });
    console.log(appInfo);
    appInfo.map(async (element) => {
      await InternApplication.updateOne(
        { _id: element.id },
        { $set: { isUpdated: false } }
      );
    });
  }
  async acceptHteOffer(applicationId, userId) {
    console.log(applicationId);

    const userData = await User.findOne({ _id: userId });
    const updateResults = await Intern.updateOne(
      { _id: userData.profile },
      { $set: { isInternshipReady: true, acceptedInternship: applicationId } }
    );
    console.log(updateResults);
    const applicationData = await InternApplication.findOne({_id: applicationId})
    const jobData = await InternVacancy.findOne({_id: applicationData.internVacancy})
    const internData = await Intern.findOne({_id: applicationData.internId})
    const updatedData = await InternApplication.updateOne(
      { _id: applicationId },
      { $set: { status: "Accepted", remarks: "Intern for deployment" } }
    );
    const acceptedIntern = new AcceptedApplicant({
      applicationId: applicationData._id,
      hteId: applicationData.hteId,
      internId: applicationData.internId,
      internId: applicationData.internId,
      jobTitle: jobData.title,
      name:internData.fullName,
      department: internData.department,
      
    })
    await acceptedIntern.save()
    return updatedData;
  }
  async getTotalHours(userID) {
    console.log(userID);
    const profileData = await User.findById({ _id: userID });
    console.log(profileData.profile);
    const profileInfo = await Intern.findById({ _id: profileData.profile });
    return profileInfo.requiredHours;
  }

  async timeIn(userId, payload) {
    const profileData = await User.findOne({ _id: userId });
    
  

    // const existingRecord = await DailyTimeRecord.findOne({
    //   internId: profileData.profile,
    //   date: payload.date,
    // });
    // console.log(existingRecord);
    // console.log(profileData.profile);
    const internProfile = await Intern.findOne(profileData.profile);
    const applicationInfo = await InternApplication.findOne(
      internProfile.acceptedInternship
    );

    const existingRecord = await DailyTimeRecord.findOne({
      internId: profileData.profile,
      jobId: applicationInfo.internVacancy,
      date: payload.date.toString(),
    });
    // console.log(existingRecord);
    if (existingRecord) {
      return {
        errorMessage: "You already Time in today",
      };
    }

    const newTimeIn = new DailyTimeRecord({
      internId: applicationInfo.internId,
      companyId: applicationInfo.hteId,
      jobId: applicationInfo.internVacancy,
      timeIn: payload.timeIn,
      timeInLocation: payload.timeInLocation,
      date: payload.date,
    });
    await newTimeIn.save();
    await Intern.updateOne(
      { _id: profileData.profile },
      { $set: { isClockIn: true } }
    );
    internProfile.dailyTimeRecords.push(newTimeIn._id);
    await internProfile.save();
    return newTimeIn;
  }
  async timeOut(userId, payload, dtrId) {
    let totalHours = 0;
    const profileData = await User.findOne({ _id: userId });
    const internProfile = await Intern.findOne(profileData.profile);

    console.log(internProfile.workedHours);
    const dtrData = await DailyTimeRecord.findOne({ internId:profileData.profile,date:payload.date });
    console.log(dtrData._id);

    const updatedDTR = await DailyTimeRecord.findOne({_id: dtrData._id});
    console.log(updatedDTR);

    (updatedDTR.timeOut = payload.timeOut),
      (updatedDTR.timeOutLocation = payload.timeOutLocation),
      await updatedDTR.save();
    console.log(updatedDTR.totalHours);
    if(updatedDTR.totalHours > 8) {
      updatedDTR.totalHours = 8
    }
    totalHours =internProfile.workedHours + updatedDTR.totalHours;
    await Intern.updateOne(
      { _id: profileData.profile },
      {
        $set: {
          isClockIn: false,
          workedHours: totalHours,
        },
      }
    );

    console.log(updatedDTR);
    return updatedDTR;
  }
  async logLocation(userId,payload) {
    const userData = await User.findOne({_id: userId})
    const updatedDataLocation = await Intern.updateOne(
      { _id: userData.profile },
      { $set: { currentLocation: payload,} }
    );
    return updatedDataLocation;

  }
  async getAttendance(userId) {
    let attendanceArr = [];
    const profileData = await User.findById({ _id: userId });
    const attendanceList = await DailyTimeRecord.find({internId: profileData.profile})
    const results = await Promise.all(

      // attendanceList.map(async(element) => {
      //   const attendanceObj = {
      //     date: element.date,
      //     timeIn: element.timeIn.toLocaleTimeString(),
      //     timeOut: element.timeOut.toLocaleTimeString(),
      //   }
      attendanceList.map(async(element) => {
        const attendanceObj = {
          date: element.date,
          timeIn: element.timeIn,
          timeOut: element.timeOut,
        }
        return attendanceObj
      })
    )
    attendanceArr.push(...results)
    return attendanceArr;

  }
}

module.exports = new InternService();
