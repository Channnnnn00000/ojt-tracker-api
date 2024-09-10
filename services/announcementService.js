// services/announcementService.js
const Announcement = require("../models/Announcement.Model");
const User = require("../models/User.Model");
const Admin = require("../models/Admin.Model");
const Coordinator = require("../models/Coordinator.Model");
class AnnouncementService {
  async addAnnouncement(userId, payload) {
    try {
      const announcement = new Announcement({
        title: payload.title,
        description: payload.description,
        category: payload.category,
        author: payload.createdBy,
        role: payload?.role ? payload.role : null,
        department: payload?.department ? payload.department : null,
        createdBy: userId,
      });
      const savedAnnouncement = await announcement.save();
      return savedAnnouncement;
    } catch (error) {
      throw new Error(`Error adding announcement: ${error.message}`);
    }
  }
  async getAnnouncement() {
    try {
      return await Announcement.find().sort({ date: -1 });
    } catch (error) {
      throw new Error(`Error adding announcement: ${error.message}`);
    }
  }
  async updateAnnouncement(announcementId,payload) {
    try {
      const foundAnnouncement = await Announcement.updateOne(
        {
          _id: announcementId,
        },
        {
          $set: { title: payload.title, description: payload.description },
        }
      );
      return foundAnnouncement;
    } catch (error) {
      throw new Error(`Error adding announcement: ${error.message}`);
    }
  }
}

module.exports = new AnnouncementService();
