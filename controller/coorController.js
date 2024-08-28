const coorService = require('../services/coorService')

class CoorController {
  async getInternUsers(req, res) {
    try {
      const listOfIntern = await coorService.getIntern(req.user.userId);

      res.status(201).json({
        message: "Success!",
        content: listOfIntern,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getHteList(req, res) {
    try {
     const listOfHte =  await coorService.fetchHteList()
      if (listOfHte) {
        return res.status(201).json({
          message: "Request Success!",
          content: listOfHte,
        });
      }
    }catch(error) {
      res.status(500).json({
        message: error.message,
      });
    }
    
  }
  async sendVisitationRequest(req, res) {
    try {
      const requestData = await coorService.sendVisitationRequest(req.body);
      if (requestData) {
        return res.status(204).json({
          message: "Request Success!",
          content: "No request sent",
        });
      }
      res.status(201).json({
        message: "Success!",
        content: requestData,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getVisitationRequest(req, res) {
    try {
      const requestData = await coorService.fetchRequestList(req.user.userId);
      if (requestData) {
        return res.status(204).json({
          message: "Request Success!",
          content: "No request sent",
        });
      }
      res.status(201).json({
        message: "Success!",
        content: requestData,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = new CoorController();
