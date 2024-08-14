const DailyTimeRecord = require("../models/DailyTimeRecord.Model");
const InternApplication = require("../models/InternApplication.Model");
const User = require("../models/User.Model");
class DTRService {
  async timeIn(userId, payload) {
    console.log(userId);
    const profileData = await User.findById(userId);
    console.log(profileData.profile);

    const applicationData = await InternApplication.find({
      internId: profileData.profile,
      status: "Accepted",
    });
    console.log(applicationData);

    // const newDTR = new DailyTimeRecord(payload);
    // await newDTR.save();
    // return newDTR;
  }
}

module.exports = new DTRService();
