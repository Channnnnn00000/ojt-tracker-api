const authService = require("../services/authService");
const userService = require("../services/userService");
class UserController {
  async userProfile(req, res) {
    try {
      const newUser = await userService.userProfile(req.user.userId);
      res.status(201).json({
        message: "Get user info!",
        user: newUser,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = new UserController();
