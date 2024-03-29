const jwt = require("jsonwebtoken");
const { User } = require("../models/user.models");
const { TOKEN_KEY, ADMIN_EMAIL } = process.env;

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  console.log("-------VERIFY TOKEN-------");
  console.log(token);
  console.log("--------------------------");
  if (token) {
    try {
      console.log(TOKEN_KEY);
      const decoded = jwt.verify(token, TOKEN_KEY);

      console.log(decoded);
      req.user = await User.findById(decoded.userID).select("-password");
      console.log(req.user);
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      // throw new Error("Not authorized Token failed");
    }
  } else {
    res.status(401);
    // throw new Error("Token Undefined");
  }
};
const verifyAdminToken = async (req, res, next) => {
  const token = req.cookies.token;
  console.log("-------VERIFY TOKEN-------");
  console.log(token);
  console.log("--------------------------");
  if (token) {
    try {
      console.log(TOKEN_KEY);
      const decoded = jwt.verify(token, TOKEN_KEY);

      console.log(decoded);
      req.user = await User.findById(decoded.userID).select("-password");
      console.log(req.user);
      if (req.user.emailID == ADMIN_EMAIL) {
        console.log("IS Admin");
        next();
      } else {
        console.log("Not an Admin");
        res.status(401).json({ message: "Not an Admin" });
      }
    } catch (error) {
      console.log(error);
      console.log("Not authorized Token failed");
      res.status(401).json({ message: "Not authorized Token failed" });
    }
  } else {
    console.log("Token Undefined");
    res.status(401).json({ message: "Token Undefined" });
  }
};

module.exports = { verifyToken, verifyAdminToken };
