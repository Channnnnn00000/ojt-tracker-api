const hteService = require("../services/hteService");

class HteController {
  async postInternship(req, res) {
    console.log(req.body);
    try {
      await hteService.postVacancy(req.user.userId, req.body);
      res.status(201).json({
        message: "Internship posted!",
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
        // req.params.userId
      );
      // console.log(listOfIntership);
      if (listOfIntership) {
        return res.status(201).json({
          data: listOfIntership.length,
          status: "Fetching Internship successful",
          content: listOfIntership,
        });
      }
      res.status(201).json({

        content: listOfIntership,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getSingleInternship(req, res) {
    try {
      const response = await hteService.getSingleInternshipApplication(
        req.params.jobId
        // req.params.userId
      );
      // console.log(listOfIntership);
      if (response) {
        return res.status(201).json({
          status: "Fetching Single Internship successful",
          content: response,
        });
      }
      res.status(201).json({
        content: response,
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
  async getListOfApplicant(req, res) {
    try {
      const listOfApplications = await hteService.getAllInternshipApplication(
        req.user.userId
      );
 
      if (listOfApplications.length) {
        res.status(201).json({
          lenght: listOfApplications.length,
          message: "Success!",
          content: listOfApplications,
        });
      }

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getListOfPendingApplicant(req, res) {
    try {
      const listOfApplications = await hteService.getInternshipApplication(
        req.user.userId
      );
 
      if (listOfApplications.length) {
        res.status(201).json({
          lenght: listOfApplications.length,
          message: "Success!",
          content: listOfApplications,
        });
      }

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async approvedApplicant(req, res) {
    try {
      const listOfApplications = await hteService.approvingApplication(
        req.user.userId,
        req.params.applicationId
      );
      res.status(201).json({
        message: "Success!",
        data: listOfApplications,
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
      return res.status(201).json({ message: "Login Success" });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getProfile(req, res) {
    try {
      const profile = await hteService.getProfile(
      );
      // console.log(listOfIntership);
      if (profile.length === 0) {
        return res.status(201).json({
          status: "Success",
          content: "No available data",
        });
      }
      res.status(201).json({
        message: "Success!",
        data: profile,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getSingleApplication(req, res) {
    try {
      const applicantsData = await hteService.getApplicationItem(
        req.params
      );
      if (applicantsData) {
        return res.status(201).json({
          status: "Success",
          content: applicantsData,
        });
      }
      res.status(400).json({
        message: "No data found",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getApprovedInterns(req, res) {
    try {
      const acceptedInterns = await hteService.getApprovedInterns(
        req.user.userId
      );
      if (acceptedInterns) {
        return res.status(201).json({
          length: acceptedInterns.length,
          status: "Success",
          content: acceptedInterns,
        });
      }
      res.status(400).json({
        message: "No data found",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = new HteController();
