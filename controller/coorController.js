const coorService = require("../services/coorService");

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
      const listOfHte = await coorService.fetchHteList();
      if (listOfHte) {
        return res.status(201).json({
          message: "Request Success!",
          content: listOfHte,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getHteItemList(req, res) {
    try {
      const itemHte = await coorService.fetchHteItemList();
      if (listOfHte) {
        return res.status(201).json({
          message: "Request Success!",
          content: itemHte,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async sendVisitationRequest(req, res) {
    try {
      const requestData = await coorService.sendVisitationRequest(req.body);
      console.log(requestData);
      if (requestData.errorMessage) {
        return res.status(400).json({
          content: requestData.errorMessage,
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
  async setRequiredHours(req, res) {
    try {
      const response = await coorService.setRequiredHours(
        req.params.id,
        req.body
      );
      res.status(201).json({
        message: "Success!",
        content: response,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }


  async getCoorEvaluation(req, res) {
    try {
      const responseData = await coorService.getCoorEvalation(req.user.userId);

      return res.status(201).json({
        status: "fetchCoorEvaluation success",
        content: responseData,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  async removeRequest(req, res) {
    console.log(req.params.id);

    try {
      const response = await coorService.removeRequest(req.params.id);
      res.status(201).json({
        message: "Remove Success!",
        content: response,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async doneRequest(req, res) {
    console.log(req.params.id);
    try {
      const response = await coorService.doneRequest(req.params.id);
      res.status(201).json({
        message: "Remove Success!",
        content: response,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getCoorEvaluation(req, res) {
    try {
      const responseData = await coorService.getCoorEvalation( req.user.userId );

      return res.status(201).json({
        status: "fetchCoorEvaluation success",
        content: responseData,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async updateMoa(req, res) {

    try {
      const responseData = await coorService.updateMOA(req.params.id,req.file);

      return res.status(201).json({
        status: "fetchCoorEvaluation success",
        content: responseData,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getInternEvaluation(req, res) {

    try {
      const responseData = await coorService.getInternsEvaluated(req.user.userId);

      return res.status(201).json({
        status: "Fetch Intern Evaluation Success",
        content: responseData,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = new CoorController();
