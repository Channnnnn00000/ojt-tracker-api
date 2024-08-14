const DTRService = require("../services/dtrService");
class DTRController {
  async timeIn(req, res) {
    try {
      const timeInData = await DTRService.timeIn(req.user.userId, req.body);
      if (timeInData) {
        return res.status(200).send(timeInData);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = new DTRController();
