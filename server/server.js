// mongodb
require("./config/db");
const express = require("express");
const cookieParser = require("cookie-parser");

const bodyParser = express.json;
const cors = require("cors");
const { PORT } = process.env;

const app = express();
const whitelist = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://wisewaste.vercel.app",
  "https://backend-wisewaste.vercel.app",
]; // add your origins here
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use(bodyParser());
app.use(cookieParser());

function bypassPublicPathsFromCookie(req, res, next) {
  const publicPaths = ["/admin/approve", "/admin/reject"];
  if (publicPaths.includes(req.path)) {
    return next();
  } else {
    return next();
    // const token = req.cookies.token;
    // if (!token) {
    //     return res.status(401).json({ message: 'Token expired. Please re-login.' });
    // }

    // // ...rest of your authentication code...
  }
}
app.use(bypassPublicPathsFromCookie);

// /authentication/signup
app.use("/authentication", require("./routes/user.routes"));
app.use("/otp", require("./routes/userOTP.routes"));
app.use("/emailverify", require("./routes/emailVerify.routes"));
app.use("/admin", require("./routes/admin.routes"));

const startApp = () => {
  app.listen(PORT, () => {
    console.log(`WiseWaste Backend running on port ${PORT}`);
  });
};

startApp();
