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
      if (req.user) {
        console.log("Valid USER");
        next();
      } else {
        console.log("Not Valid USER");
        res.status(401).json({ message: "Token Error" });
      }
    } catch (error) {
      console.log(error);
      console.log("Not authorized Token failed");
      res.status(401).json({ message: "Token Error" });
    }
  } else {
    console.log("Token Undefined");
    res.status(401).json({ message: "Token Error" });
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
        res.status(401).json({ message: "Token Error" });
      }
    } catch (error) {
      console.log(error);
      console.log("Not authorized Token failed");
      res.status(401).json({ message: "Token Error" });
    }
  } else {
    console.log("Token Undefined");
    res.status(401).json({ message: "Token Error" });
  }
};

module.exports = { verifyToken, verifyAdminToken };
