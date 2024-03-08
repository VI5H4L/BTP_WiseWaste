const jwt = require("jsonwebtoken");
const {User} = require("../models/user.models");
const { TOKEN_KEY } = process.env;

const verifyToken = async (req, res, next) => {

    if ( req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            console.log("success 1");
          token = req.headers.authorization.split(" ")[1];
          console.log("success 1");
          console.log(JSON.parse(token));
          console.log(token);
          console.log(TOKEN_KEY);
          const decoded = jwt.verify(JSON.parse(token), TOKEN_KEY);

          console.log(decoded)
          req.user = await User.findById(decoded.userID).select("-password");
          console.log(req.user);
          next();
        } catch (error) {
          console.log(error);
          res.status(401);
          throw new Error("not authorized token failed");
        }
    }
}

module.exports = verifyToken;