const User = require("../models/User.Model");
const jwtUtils = require("../utils/jwtUtils");
const bcrypt = require("bcryptjs");

class UserService {
  async userProfile(id) {
    const user = await User.findById({ _id: id });
    return user;
  }
}

module.exports = new UserService();
