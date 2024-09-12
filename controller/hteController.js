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

      res.status(201).json({
        message: "Success!",
        content: listOfApplications,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getlistOfAcceptedInterns(req, res) {
    try {
      const listOfApplications = await hteService.getInternshipAccepted(
        req.user.userId
      );

      if (listOfApplications) {
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
      console.log(listOfApplications);
      if (listOfApplications === "Intern is not available") {
        return res.status(400).json({
          message: "Error!",
          content: listOfApplications,
        });
      }
      res.status(201).json({
        message: "Success!",
        content: listOfApplications,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async rejectApplicant(req, res) {
    try {
      const response = await hteService.rejectApplication(
        req.user.userId,
        req.params.applicationId
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
      const profile = await hteService.getProfile();
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
      const applicantsData = await hteService.getApplicationItem(req.params);
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
  async getOnlineInterns(req, res) {
    try {
      const onlineInterns = await hteService.getOnlineIntern(req.user.userId);

      if (onlineInterns) {
        return res.status(200).json({
          content: onlineInterns,
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
  async getListingItem(req, res) {
    try {
      const data = await hteService.getListingItem(req.params.id);
      return res.status(201).json({
        status: "Success",
        content: data,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async updateListingItem(req, res) {
    try {
      const data = await hteService.updateListingItem(req.params.id, req.body);
      return res.status(201).json({
        status: "Update success",
        content: data,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async fetchVisitRequest(req, res) {
    try {
      const responseData = await hteService.getFetchRequest(req.user.userId);
      return res.status(201).json({
        status: "Fetch success",
        content: responseData,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async acceptVisitRequest(req, res) {
    try {
      const responseData = await hteService.acceptVisitRequest(
        req.user.userId,
        req.params.id
      );
      return res.status(201).json({
        status: "Accept success",
        content: responseData,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async rejectVisitRequest(req, res) {
    try {
      const responseData = await hteService.rejectVisitRequest(
        req.user.userId,
        req.params.id,
        req.body
      );
      return res.status(201).json({
        status: "Reject success",
        content: responseData,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async postEvaluation(req, res) {
    try {
      const responseData = await hteService.submitEvaluation(
        req.params.id,req.body
      );
      return res.status(201).json({
        status: "postEvaluation success",
        content: responseData,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getHteEvaluation(req, res) {
    try {
      const responseData = await hteService.getHteEvaluationItem(req.params.id);

      return res.status(201).json({
        status: "fetch HteEvaluation success",
        content: responseData,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async updateHteInformation(req, res) {
    console.log(req.body);
    console.log(req.user.userId);
    try {
      const response = await hteService.updateHTEInformation(
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
  async changePassword(req, res) {
    try {
      const response = await hteService.changeHtePassword(
        req.user.userId,
        req.body,
        res
      );
      if(response === null) 
        {
          return res.status(400).json({
            content:'Old password not much'
          })
        }
      return res.status(201).json(response);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getInternsData(req, res) {
    try {
      const response = await hteService.getInternsData(
        req.params.id,
      
      );
      return res.status(201).json(response);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = new HteController();
