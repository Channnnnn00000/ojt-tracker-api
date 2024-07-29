const internService = require("../services/internService");

class InternController {
  async login(req, res) {
    const { username, password } = req.body;
    try {
      const token = await internService.loginIntern(username, password);
      if (!token)
        return res.status(401).json({ message: "Invalid credentials" });

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      // res.setHeader("Authorization", `Bearer ${token}`);
      res.json({ token });
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
        data: listOfIntership,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getVacancy(req, res) {
    try {
      const listOfVacancy = await internService.getVacancy(req.user.userId);
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
        message: "Success!",
        data: listOfApplication,
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
        req.body
      );

      return res.status(201).json({
        status: "Success",
        data: applyInformation,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
}

module.exports = new InternController();
