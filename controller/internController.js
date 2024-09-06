const internService = require("../services/internService");

class InternController {
  async login(req, res) {
    const { username, password, sessionCode } = req.body;

    try {
      const token = await internService.loginIntern(
        username,
        password,
        sessionCode
      );
      if (!token)
        return res.status(401).json({ message: "Invalid credentials" });
      if (token.message) {
        return res.status(401).json({
          message: token.message,
        });
      }
      if (token.token) {
        res.cookie("jwt", token.token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        return res.status(201).json({
          message: "Login Success",
          content: token.codeRestriction,
        });
      }

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      // res.setHeader("Authorization", `Bearer ${token}`);
      return res.status(201).json({
        message: "Login Success",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getProfileInformation(req, res) {
    try {
      const listOfIntership = await internService.getInternInformation(
        req.user.userId
      );
      res.status(201).json({
        message: "Success!",
        content: listOfIntership,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getVacancy(req, res) {
    try {
      // const listOfVacancy = await internService.getVacancy(req.user.userId);
      const listOfVacancy = await internService.getVacancy();
      res.status(201).json({
        message: "Success!",
        content: listOfVacancy,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getSingleVacancy(req, res) {
    try {
      const listOfVacancy = await internService.getSingleVacancy(req.params.id);
      res.status(201).json({
        message: "Success!",
        data: listOfVacancy,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getApplicationList(req, res) {
    try {
      const listOfApplication = await internService.getInternApplicationList(
        req.user.userId
      );
      res.status(201).json({
        message: "Fetching application success",
        content: listOfApplication,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async applyInternShip(req, res) {
    try {
      const applyInformation = await internService.applyInternship(
        req.user.userId,
        req.params.id,
        req.files
      );
      if (applyInformation.ErrorMessage) {
        return res.status(400).json({
          content: "Already applied to this internship",
        });
      }
      return res.status(201).json({
        status: "Success",
        data: applyInformation,
        message: applyInformation.message,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
  async setStateToFalse(req, res) {
    try {
      await internService.applyReset(req.user.userId);
      res.status(201).json({
        message: "Reset state success!",
        data: results,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async acceptHteOffer(req, res) {
    try {
      const response = await internService.acceptHteOffer(
        req.params.id,
        req.user.userId
      );
      res.status(200).json({
        message: "Success",
        content: response,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getTotalHoursRequired(req, res) {
    try {
      const totalHoursRequired = await internService.getTotalHours(
        req.user.userId
      );
      res.status(200).json({
        status: true,
        content: totalHoursRequired,
      });
    } catch (err) {
      res.status(400).json({
        content: "Failed to get the total hours required",
        status: err.message,
      });
    }
  }
  async timeInHandler(req, res) {
    try {
      const response = await internService.timeIn(req.user.userId, req.body);
      if (response.errorMessage) {
        return res.status(400).json({
          status: false,
          content: response.errorMessage,
        });
      }
      if (response) {
        return res.status(200).json({
          status: true,
          content: response,
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }
  async timeOutHandler(req, res) {
    try {
      const response = await internService.timeOut(
        req.user.userId,
        req.body
        // req.params.id
      );
      if (response) {
        res.status(200).json({
          status: true,
          content: response,
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }
  async getCurrentLocationHandler(req, res) {
    try {
      const resultsLocation = await internService.logLocation(
        req.user.userId,
        req.body
      );

      if (resultsLocation) {
        res.status(200).json({
          content: resultsLocation.acknowledged,
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }
  async getAttendance(req, res) {
    try {
      const response = await internService.getAttendance(req.user.userId);
      if (response) {
        res.status(200).json({
          content: response,
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }
  async removeApplicationData(req, res) {
    try {
      const resultsLocation = await internService.removeApplication(
        req.user.userId,
        req.params.id
      );

      res.status(200).json({
        content: resultsLocation,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }
  async getInternEvaluation(req, res) {
    try {
      const responseData = await internService.getInternEvalation(
        req.user.userId
      );

      return res.status(201).json({
        status: "fetchInternEvaluation success",
        content: responseData,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getApplicationInfo(req, res) {
    try {
      const response = await internService.getApplicationInfo(req.params.id);
      return res.status(201).json(response);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async updateInternInformation(req, res) {
    console.log(req.body);
    console.log(req.params.id);
    console.log(req.user.userId);
    try {
      const response = await internService.updateInternInformation(
        req.user.userId,
        req.body
      );
      return res.status(201).json(response);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = new InternController();
