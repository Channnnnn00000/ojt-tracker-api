const hteService = require("../services/hteService");

class HteController {
  async postInternship(req, res) {
    try {
      await hteService.postVacancy(req.user.userId, {
        title: req.body.title,
        description: req.body.description,
        slots: req.body.slots,
        location: req.body.location,
      });
      res.status(201).json({
        message: "Internship posted!",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async updateInternship(req, res) {
    try {
      const updatedInternship = await hteService.updatePostVacancy(
        req.params.id,
        req.body
      );
      res.status(201).json({
        message: "Internship updated!",
        data: updatedInternship,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async deleteInternship(req, res) {
    try {
      await hteService.deletePostVacancy(req.params.id);
      res.status(201).json({
        status: "Deleted",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getListOfInternship(req, res) {
    try {
      const listOfIntership = await hteService.getPostedInternship(
        req.user.userId
      );
      console.log(listOfIntership);
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

  async login(req, res) {
    const { username, password } = req.body;
    try {
      const token = await hteService.loginUser(username, password);
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
}

module.exports = new HteController();
