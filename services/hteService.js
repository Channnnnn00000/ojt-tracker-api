const InternshipVacancy = require("../models/InternVacancy.Model");
const HTE = require("../models/HTE.Model");
const User = require("../models/User.Model");
const Intern = require("../models/Intern.Model");
const InternApplication = require("../models/InternApplication.Model");
const AcceptedApplicant = require("../models/AcceptedApplicant");
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
  async getPostedInternship(id) {
    const userData = await User.findOne({ _id: id }).exec();
    const profileData = await HTE.findOne({ _id: userData.profile })
      .populate("internVacancy")
      .exec();
    return profileData.internVacancy;
  }
  async updatePostVacancy(id, payload) {
    const updatedData = await InternshipVacancy.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return updatedData;
  }
  async deletePostVacancy(id) {
    return await InternshipVacancy.findByIdAndDelete(id);
  }

  // View only application you posted
  async getInternshipApplication(id) {
    const listOfApplicants = await InternApplication.find({
      hteId: id,
      status: "pending",
    });
    return listOfApplicants;
  }
  async acceptApplication(userId, applicationId, res) {
    const application = await InternApplication.findById(applicationId);

    const vacancyData = await InternshipVacancy.findById(
      application.internVacancy
    );
    const slotsRemaining = vacancyData.slots - 1;
    await InternshipVacancy.updateOne(
      { _id: application.internVacancy },
      { $set: { slots: slotsRemaining } }
    );
    vacancyData.acceptedApplicants.push(application.internId);
    await vacancyData.save();

    const internUser = await User.findById(application.internId);

    const internData = await Intern.findById(internUser.profile);
    internData.acceptedInternships.push(application.internVacancy);
    await internData.save();

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    const updateResult = await InternApplication.updateOne(
      { _id: applicationId },
      { $set: { status: "accepted" } }
    );
    if (updateResult.nModified === 0) {
      return res
        .status(400)
        .json({ message: "Failed to update application status" });
    }
    const acceptedApplicant = new AcceptedApplicant({
      jobId: application.id,
      applicantId: application.internId,
      acceptedDate: new Date(),
    });
    await acceptedApplicant.save();
  }
  async getProfile() {
    return await HTE.find().populate('internVacancy').exec()
  }
}

module.exports = new HTEService();
