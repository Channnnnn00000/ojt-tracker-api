const announcementService = require("../services/announcementService");

class Announcement {
  async addAnnouncement(req, res) {
    try {
      const newAnnouncement = await announcementService.addAnnouncement(
        req.user.userId,
        req.body
      );
      res.status(201).json({
        message: "Announcement added successfully",
        announcement: newAnnouncement,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async getAnnouncement(req, res) {
    try {
      const newAnnouncement = await announcementService.getAnnouncement();
      res.status(201).json({
        message: "Announcement fetching successfully",
        content: newAnnouncement,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async updateAnnouncement(req, res) {
    console.log(req.body);
    console.log(req.params.id);
    
    try {
      const newAnnouncement = await announcementService.updateAnnouncement(
        req.params.id,req.body
      );
      res.status(201).json({
        message: "Announcement update successfully",
        content: newAnnouncement,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
module.exports = new Announcement();
