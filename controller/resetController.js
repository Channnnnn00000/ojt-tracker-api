const resetService = require("../services/resetService");
class ResetController {
  async resetPasswordRequestController(req, res, next) {
    const requestPasswordResetService = await resetService.requestReset(
      req.body.email
    );
    if (requestPasswordResetService.message) {
      return res.status(400).json({
        content: requestPasswordResetService.message,
      });
    }
    return res.json(requestPasswordResetService);
  }
  async resetPasswordController(req, res, next) {
    const resetPasswordService = await resetService.resetPassword(
      req.body.userId,
      req.body.token,
      req.body.password
    );
    return res.json(resetPasswordService);
  }
}

module.exports = new ResetController();
