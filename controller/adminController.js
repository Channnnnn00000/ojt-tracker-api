const adminService = require("../services/adminService");

class AdminController {
  // Authentication
  async login(req, res) {
    const { username, password } = req.body;
    try {
      const token = await adminService.loginAdmin(username, password);
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
  async logout(req, res) {
    await res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    await res.sendStatus(204);
  }
  // Get info of loggedIn user
  async checkUserLoggedIn(req, res) {
    console.log(req.user.userId);
    try {
      const userInfo = await adminService.getLoggedInUser(req.user.userId);
      res.status(200).json({
        content: userInfo,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  // Registration of each role

  async userRegistration(req, res) {
    try {
      const newUser = await adminService.registerAdmin(req.body);
      res.status(201).json({
        message: "New Admin added",
        content: newUser,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async hteRegistration(req, res) {
    try {
      await adminService.registerHTE(req.body);
      res.status(201).json({
        message: "New HTE Added",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async coorRegistration(req, res) {
    try {
      await adminService.registerCoordinator(req.body);
      res.status(201).json({
        message: "New Coordinator added",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async internRegistration(req, res) {
    try {
      await adminService.registerIntern(req.body);
      res.status(201).json({
        message: "New Intern added",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  // Get list of users for each role
  async getAllUsers(req, res) {
    try {
      const listOfUsers = await adminService.getAllUsers();
      if (listOfUsers.length === 0) {
        return res.status(201).json({
          message: "Request Success!",
          content: listOfUsers,
        });
      }
      return res.status(201).json({
        message: "Success!",
        content: listOfUsers,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  async getAdminUsers(req, res) {
    try {
      const listOfAdmin = await adminService.getAdmin();
      if (listOfAdmin.length === 0) {
        return res.status(201).json({
          message: "Request Success!",
          content: "No admin users found",
        });
      }
      return res.status(201).json({
        message: "Success!",
        content: listOfAdmin,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getHteUsers(req, res) {
    try {
      const listOfHTE = await adminService.getHTE();
      if (listOfHTE.length === 0) {
        return res.status(201).json({
          message: "Request Success!",
          content: "No hte users found",
        });
      }
      res.status(201).json({
        message: "Success!",
        content: listOfHTE,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getCoorUsers(req, res) {
    try {
      const listOfCoor = await adminService.getCoor();
      if (listOfCoor) {
        return res.status(201).json({
          message: "Request Success!",
          content: listOfCoor,
        });
      }
      res.status(204).json({
        message: "Success!",
        content: listOfCoor,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getInternUsers(req, res) {
    try {
      const listOfIntern = await adminService.getIntern();
      if (listOfIntern.length === 0) {
        return res.status(204).json({
          message: "Request Success!",
          content: "No intern users found",
        });
      }
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

  // Updating users
  async updateAdmin(req, res) {
    try {
      const updatedData = await adminService.updateAdmin(
        req.params.id,
        req.body
      );
      res.status(201).json({
        message: "Updated!",
        data: updatedData,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async updateHTE(req, res) {
    try {
      const updatedData = await adminService.updateHTE(req.params.id, req.body);
      res.status(201).json({
        message: "Updated!",
        data: updatedData,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async updateCoor(req, res) {
    try {
      const updatedData = await adminService.updateCoor(
        req.params.id,
        req.body
      );
      res.status(201).json({
        message: "Updated!",
        data: updatedData,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async updateIntern(req, res) {
    try {
      const updatedData = await adminService.updateIntern(
        req.params.id,
        req.body
      );
      res.status(201).json({
        message: "Updated!",
        data: updatedData,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  // Removing users
  async removeAccount(req, res) {
    try {
      await adminService.removeAccount(req.params.id);
      res.status(201).json({
        message: "Successfully Deleted!",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getAccountInfo(req, res) {
    try {
      const data = await adminService.getUserInformation(req.params.id);
      res.status(201).json({
        message: "Success!",
        content: data,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async updateAccountInfo(req, res) {
    console.log(req.body);
    console.log(req.params.id);

    try {
      const data = await adminService.updateUserInfo(req.params.id, req.body);
      res.status(201).json({
        message: "Success!",
        content: data,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  //#region  Department List
  async fetchDepartmentList(req, res) {
    try {
      const results = await adminService.getDepartmentList();
      res.status(201).json({
        message: "Success fetching",
        content: results,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async addDepartment(req, res) {
    try {
      const results = await adminService.addDepartment(req.body);
      res.status(201).json({
        message: "Added Department",
        content: results,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async updateDepartment(req, res) {
    try {
      const results = await adminService.updateDepartment(
        req.params.id,
        req.body
      );
      res.status(201).json({
        message: "Update Success!",
        content: results,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async deleteDepartment(req, res) {
    try {
      await adminService.deleteDepartment(req.params.id);
      res.status(201).json({
        message: "Delete Success!",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  //#endregion
  //#region Interns List
  async getInternsList(req, res) {
    try {
      const data = await adminService.getListOnInterns();
      res.status(201).json({
        message: "Success!",
        content: data,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getDTRLogs(req, res) {
    try {
      const data = await adminService.getDTRLogs(req.params.id);
      res.status(201).json({
        message: "Success!",
        content: data,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async reseDeviceRestriction(req, res) {
    try {
      const data = await adminService.resetInternsDevice(req.params.id);
      res.status(201).json({
        message: "Success!",
        content: data,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  //#endregion
  //#region HTE List
  async getHTEList(req, res) {
    try {
      const data = await adminService.getListOfHTE();
      res.status(201).json({
        message: "Success!",
        content: data,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async getHTEInternshipLists(req, res) {
    try {
      const data = await adminService.getInternshipsList(req.params.id);
      res.status(201).json({
        message: "Success!",
        content: data,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  //#endregion
  //#region Coordinator List
  async getCoordinatorList(req, res) {
    try {
      const data = await adminService.getListOfCoordinator();
      res.status(201).json({
        message: "Success!",
        content: data,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  //#endregion
}

module.exports = new AdminController();
