// const authService = require("../services/authService");

// class AuthController {
//   async register(req, res) {
//     const { username, password } = req.body;
//     console.log(req.body);
//     try {
//       const newUser = await authService.registerUser(username, password);
//       res.status(201).json({
//         message: "User registered successfully!",
//         user: newUser,
//       });
//     } catch (error) {
//       res.status(500).json({
//         message: error.message,
//       });
//     }
//   }
//   async login(req, res) {
//     const { username, password } = req.body;
//     try {
//       const token = await authService.loginUser(username, password);
//       if (!token)
//         return res.status(401).json({ message: "Invalid credentials" });

//       //   res.cookie("jwt", token, {
//       //     httpOnly: true,
//       //     secure: true,
//       //     sameSite: "none",
//       //   });
//       res.setHeader("Authorization", `Bearer ${token}`);
//       res.json({ token });
//     } catch (error) {
//       res.status(500).json({
//         message: error.message,
//       });
//     }
//   }
// }

// module.exports = new AuthController();
