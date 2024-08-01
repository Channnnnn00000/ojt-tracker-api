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
      res.json({ token });
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
          content: "No users found",
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
          data: "No admin users found",
        });
      }
      return res.status(201).json({
        message: "Success!",
        data: listOfAdmin,
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
          data: "No hte users found",
        });
      }
      res.status(201).json({
        message: "Success!",
        data: listOfHTE,
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
      if (listOfCoor.length === 0) {
        return res.status(201).json({
          message: "Request Success!",
          data: "No coor users found",
        });
      }
      res.status(201).json({
        message: "Success!",
        data: listOfCoor,
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
        return res.status(201).json({
          message: "Request Success!",
          data: "No intern users found",
        });
      }
      res.status(201).json({
        message: "Success!",
        data: listOfIntern,
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
  async removeAdmin(req, res) {
    try {
      await adminService.removeAdmin(req.params.id);
      res.status(201).json({
        message: "Successfully Deleted!",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async removeHTE(req, res) {
    try {
      await adminService.removeHTE(req.params.id);
      res.status(201).json({
        message: "Successfully Deleted!",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async removeCoor(req, res) {
    try {
      await adminService.removeCoor(req.params.id);
      res.status(201).json({
        message: "Successfully Deleted!",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async removeIntern(req, res) {
    try {
      await adminService.removeIntern(req.params.id);
      res.status(201).json({
        message: "Successfully Deleted!",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  // async login(req, res) {
  //   const { username, password } = req.body;
  //   try {
  //     const token = await authService.loginUser(username, password);
  //     if (!token)
  //       return res.status(401).json({ message: "Invalid credentials" });

  //     //   res.cookie("jwt", token, {
  //     //     httpOnly: true,
  //     //     secure: true,
  //     //     sameSite: "none",
  //     //   });
  //     res.setHeader("Authorization", `Bearer ${token}`);
  //     res.json({ token });
  //   } catch (error) {
  //     res.status(500).json({
  //       message: error.message,
  //     });
  //   }
  // }
}

module.exports = new AdminController();
