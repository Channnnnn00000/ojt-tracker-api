const User = require("../models/User.Model");
const HTE = require("../models/HTE.Model");
const Intern = require("../models/Intern.Model");
const InternVacancy = require("../models/InternVacancy.Model");
const InternApplication = require("../models/InternApplication.Model");
const AcceptedApplicant = require("../models/AcceptedApplicant");
const jwtUtils = require("../utils/jwtUtils");
const bcrypt = require("bcryptjs");
const DailyTimeRecord = require("../models/DailyTimeRecord.Model");
const moment = require("moment-timezone");
const crypto = require("crypto");
const Evaluation = require("../models/Evaluation.Model");

class InternService {
  async loginIntern(username, password, sessionCode) {
    const generateSessionCode = () => crypto.randomBytes(32).toString("hex");
    const user = await User.findOne({ username });
    if (!user) {
      return { message: "Account not found" };
    }
    const intern = await Intern.findOne({ _id: user.profile.toString() });
    console.log(intern);
    console.log(sessionCode);
    if (user.role === "Intern") {
      if (intern.sessionCode) {
        if (intern.sessionCode !== sessionCode) {
          console.log("not equal to the save device");
          return { message: "Login not allowed from this device." };
        }
      } else {
        console.log("saving sessiong here");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return {
            message: "Wrong password. Please Try again",
          };
        }
        intern.sessionCode = generateSessionCode();
        await intern.save();

        return {
          token: isMatch
            ? jwtUtils.generateToken(user._id, user.username)
            : null,
          codeRestriction: intern.sessionCode,
        };
      }
    }

    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? jwtUtils.generateToken(user._id, user.username) : null;
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
          company: hteInfo.fullName,
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
      console.log(payload[0].filename);
      console.log(payload[1].filename);
      const newApplication = new InternApplication({
        hteId: vacancyData.hte,
        internId: userData.profile,
        internVacancy: jobId,

        // resumePath: "http://localhost:4000/img/" + payload[0].filename,
        resumePath: payload[0]?.filename
          ? `https://ojttracker.site/img/${payload[0].filename}`
          : null,
        resumeFile: payload[0].filename,

        parentConsentPath: payload[1]?.filename
          ? `https://ojttracker.site/img/${payload[1].filename}`
          : null,
        // parentConsentPath: payload[1]?.filename
        //   ? `http://localhost:4000/img/${payload[1].filename}`
        //   : null,
        parentConsentFile: payload[1]?.filename || null,

        internEndorsementPath: payload[2]?.filename
          ? `https://ojttracker.site/img/${payload[2].filename}`
          : null,
        // internEndorsementPath: payload[2]?.filename
        //   ? `http://localhost:4000/img/${payload[2].filename}` : null,
        internEndorsementFile: payload[2]?.filename || null,

        moaPath: payload[3]?.filename
          ? `https://ojttracker.site/img/${payload[3].filename}`
          : null,
        // moaPath: payload[3]?.filename
        //   ? `http://localhost:4000/img/${payload[3].filename}`
        //   : null,
        moaFile: payload[3]?.filename || null,

        firstEndorsementFormPath: payload[4]?.filename
          ? `https://ojttracker.site/img/${payload[4].filename}`
          : null,
        // firstEndorsementFormPath: payload[4]?.filename
        //   ? `http://localhost:4000/img/${payload[4].filename}`
        //   : null,
        firstEndorsementFormFile: payload[4]?.filename || null,

        certificationFormPath: payload[5]?.filename
          ? `https://ojttracker.site/img/${payload[5].filename}`
          : null,
        // certificationFormPath: payload[5]?.filename
        //   ? `http://localhost:4000/img/${payload[5].filename}`
        //   : null,
        certificationFormFile: payload[5]?.filename || null,

        internshipAgreementPath: payload[6]?.filename
          ? `https://ojttracker.site/img/${payload[6].filename}`
          : null,

        // internshipAgreementPath: payload[6]?.filename
        //   ? `http://localhost:4000/img/${payload[6].filename}`
        //   : null,
        internshipAgreementFile: payload[6]?.filename || null,
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
        resumePath: "https://ojttracker.site/img/" + payload[0].filename,
        // resumePath: "http://localhost:4000/img/" + payload[0].filename,
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
    const applicationData = await InternApplication.findOne({
      _id: applicationId,
    });
    const jobData = await InternVacancy.findOne({
      _id: applicationData.internVacancy,
    });
    const internData = await Intern.findOne({ _id: applicationData.internId });
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
      name: internData.fullName,
      department: internData.department,
    });
    await acceptedIntern.save();
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
      { $set: { isClockIn: true, currentLocation: payload.timeInLocation } }
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
    const dtrData = await DailyTimeRecord.findOne({
      internId: profileData.profile,
      date: payload.date,
    });
    console.log(dtrData._id);

    const updatedDTR = await DailyTimeRecord.findOne({ _id: dtrData._id });
    console.log(updatedDTR);

    updatedDTR.timeOut = payload.timeOut;
    updatedDTR.timeOutLocation = payload.timeOutLocation;
    await updatedDTR.save();
    console.log(updatedDTR.totalHours);
    if (updatedDTR.totalHours > 8) {
      updatedDTR.totalHours = 8;
    }
    totalHours = internProfile.workedHours + updatedDTR.totalHours;
    await Intern.updateOne(
      { _id: profileData.profile },
      {
        $set: {
          isClockIn: false,
          workedHours: totalHours,
        },
      }
    );
    const internData = await Intern.findOne(profileData.profile);
    if (internData.workedHours >= internData.requiredHours) {
      const updated = await Intern.updateOne(
        { _id: profileData.profile.toString() },
        {
          $set: {
            isEvaluationReady: "Ready",
          },
        }
      );
    }
    console.log(updatedDTR);
    return updatedDTR;
  }
  async logLocation(userId, payload) {
    const userData = await User.findOne({ _id: userId });
    const updatedDataLocation = await Intern.updateOne(
      { _id: userData.profile },
      { $set: { currentLocation: payload } }
    );
    return updatedDataLocation;
  }
  async getAttendance(userId) {
    let attendanceArr = [];
    const profileData = await User.findById({ _id: userId });
    const attendanceList = await DailyTimeRecord.find({
      internId: profileData.profile,
    });
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
          date: element.date,
          timeIn: phtDateTimeIn,
          timeOut: element.timeOut === null ? null : phtDateTimeOut,
          totalHours: element.totalHours
        };
        return attendanceObj;
      })
    );
    attendanceArr.push(...results);
    return attendanceArr;
  }
  async removeApplication(userId, applicationId) {
    await InternApplication.findByIdAndDelete({ _id: applicationId });
  }
  async getInternEvalation(userId) {
    const userData = await User.findOne({ _id: userId }).exec();
    const internData = await Intern.findOne({
      _id: userData.profile.toString(),
    }).exec();
    if (!internData) {
      return {
        message: "No Available Data",
      };
    }
    const evaluationData = await Evaluation.find({
      internId: internData,
    }).exec();
    return evaluationData;
  }
  async getApplicationInfo(applicationId) {
    return await InternApplication.findOne({ _id: applicationId });
  }
  async updateInternInformation(userId, payload) {
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
    const internData = await Intern.updateOne(
      { _id: userData.profile.toString() },
      {
        $set: {
          firstName: payload.firstName,
          middleInitial: payload.middleInitial,
          lastName: payload.lastName,
          contact: payload.contact,
          age: payload.age,
          birthday: payload.birthday,
          street: payload.street,
          brgy: payload.brgy,
          municipality: payload.municipality,
          province: payload.province,
          zipcode: payload.zipcode,
          isProfileComplete: true,
        },
      }
    );
  }
  async changeInternPassword(userId, payload) {
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
  async getHteInformation(hteId) {
    return await HTE.findOne({ _id: hteId });
  }
  async getEvaluationResults(userId) {
    const userData = await User.findOne({ _id: userId });
    const evalResults = await Evaluation.findOne({
      internId: userData.profile,
    });
    console.log(evalResults);
    return evalResults;
  }
  async checkTimeOutStatus(userId,payload) {
    console.log(payload)
    const profileData = await User.findOne({ _id: userId });
    const internProfile = await Intern.findOne(profileData.profile);
    const applicationInfo = await InternApplication.findOne(
      internProfile.acceptedInternship
    );

    const existingRecord = await DailyTimeRecord.findOne({
      internId: profileData.profile,
      jobId: applicationInfo.internVacancy,
      date: payload.date
    });
    if(!existingRecord) {
      const clockStatus = await Intern.updateOne(
        { _id: internProfile._id },
        {
          $set: {
            isClockIn: false,
          },
        }
      );
      return clockStatus
    }

  }
}

module.exports = new InternService();
