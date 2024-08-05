const jwtUtils = require("../utils/jwtUtils");
class AuthMiddleware {
  verifyToken(req, res, next) {
    let token = req.cookies.jwt || req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    // if (token.startsWith("Bearer ")) {
    //   token = token.slice(7, token.length); // Remove "Bearer " prefix
    // }
    try {
      const decoded = jwtUtils.verifyToken(token);
      //   const decoded = jwt.verify(token, "your_secret_key"); // Replace with your secret
      req.user = decoded;
      console.log(req.user.userId); // Attach decoded user data to the request
      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
  }
}

module.exports = new AuthMiddleware();
