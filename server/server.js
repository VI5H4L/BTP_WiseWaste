// mongodb
require("./config/db");
const express = require("express");
const bodyParser = express.json;
const cors = require("cors");
const { PORT } = process.env;

// create server app
const app = express();

app.use(cors());
// app.options('*', cors());
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
