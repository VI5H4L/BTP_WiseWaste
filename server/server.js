// mongodb
require("./config/db");
const express = require("express");
const bodyParser = express.json;
const cors = require("cors");
const { PORT } = process.env;

// create server app
const app = express();
app.options('*', cors());
// app.use(cors());

app.use(cors({
  origin: 'https://wisewaste.vercel.app' // Allow only this origin
}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://wisewaste.vercel.app");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(bodyParser());

// /authentication/signup
app.use('/authentication', require('./routes/user.routes'));
app.use('/otp', require("./routes/userOTP.routes"));
app.use('/emailverify', require("./routes/emailVerify.routes"));
app.use('/admin', require("./routes/adminVerify.routes"));

const startApp = () =>{
    app.listen(PORT, ()=>{
        console.log(`WiseWaste Backend running on port ${PORT}`);
    });
};

startApp();