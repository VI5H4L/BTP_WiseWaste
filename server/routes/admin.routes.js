const express = require("express");
const router = express.Router();
const { User } = require("../models/user.models");
const { ManageZone } = require("../models/managezone.models");

const sendEmail = require("../utils/sendEmail");
const { REQUESTS_AUTH_EMAIL } = process.env;
const { ADMIN_EMAIL } = process.env;

router.route("/approve").get(async (req, res) => {
  try {
    let emailID = req.query.emailID;
    console.log("Approved");
    console.log(emailID);
    const existingUser = await User.findOne({ emailID });
    if (existingUser) {
      console.log(existingUser);
      existingUser.adminVerified = true;
      // now update user record to show verified.
      await User.updateOne({ emailID }, { adminVerified: true });
      console.log(existingUser);
      // send email to Admin
      const mailOptionsUser = {
        from: REQUESTS_AUTH_EMAIL,
        to: emailID,
        subject: "Request Approved by Admin",
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: 'Helvetica Neue', Helvetica, Arial, Poppins, sans-serif;
                    background-color: #f7f7f7;
                    margin: 0;
                    padding: 0;
                    color: #555555;
                }
                .email-container {
                    max-width: 600px;
                    margin: auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 4px;
                    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    background-color: #243727;
                    color: #ffffff;
                    padding: 10px 20px;
                    text-align: center;
                    border-radius: 4px 4px 0 0;
                }
                .email-body {
                    padding: 20px;
                    text-align: center;
                }
                .email-footer {
                    font-size: 12px;
                    text-align: center;
                    padding: 20px;
                    color: #aaaaaa;
                }
                .login-link {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 15px;
                    border: 2px solid #243727;
                    color: #243727;
                    text-decoration: none;
                    border-radius: 4px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h2>Wise Waste!</h2>
                </div>
                <div class="email-body">
                    <p>Your request has been <strong>Approved</strong> by the Admin.</p>
                    <p>Now you can successfully login to WiseWaste using your registered email: <strong>${emailID}</strong>.</p>
                    <a href="https://wisewaste.vercel.app/login" class="login-link">Login to WiseWaste</a>
                </div>
                <div class="email-footer">
                    Welcome to Wise Waste! If you need any assistance, please contact support.
                </div>
            </div>
        </body>
        </html>
                `,
      };
      await sendEmail(mailOptionsUser);
    } else {
      // throw Error("User with the provided email already exists");
      res.json({
        success: false,
        message:
          "Error come in Approved part of verified email by adimn of user",
      });
    }
    res.send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: 'Helvetica Neue', Helvetica, Arial, Poppins, sans-serif;
                    background-color: #f7f7f7;
                    margin: 0;
                    padding: 0;
                    color: #555555;
                }
                .email-container {
                    max-width: 600px;
                    margin: auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 4px;
                    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    background-color: #243727;
                    color: #ffffff;
                    padding: 10px 20px;
                    text-align: center;
                    border-radius: 4px 4px 0 0;
                }
                .email-body {
                    padding: 20px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h2>Wise Waste!</h2>
                </div>
                <div class="email-body">
                    <h2>Request Approved!</h2>
                    <p>Request is Approved by the admin for <strong>${emailID}</strong></p>
                </div>
            </div>
        </body>
        </html>
        `);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.route("/reject").get(async (req, res) => {
  try {
    let emailID = req.query.emailID;
    console.log("Reject");
    console.log(emailID);
    const existingUser = await User.findOne({ emailID });
    if (existingUser) {
      console.log(existingUser);
      existingUser.adminVerified = false;
      // now update user record to show verified.
      await User.updateOne({ emailID }, { adminVerified: false });
      console.log(existingUser);
      // send email to Admin
      const mailOptionsUser = {
        from: REQUESTS_AUTH_EMAIL,
        to: emailID,
        subject: "Request Rejected by Admin",
        html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: 'Helvetica Neue', Helvetica, Arial, Poppins, sans-serif;
                            background-color: #f7f7f7;
                            margin: 0;
                            padding: 0;
                            color: #555555;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: auto;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 4px;
                            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
                        }
                        .email-header {
                            background-color: #243727;
                            color: #ffffff;
                            padding: 10px 20px;
                            text-align: center;
                            border-radius: 4px 4px 0 0;
                        }
                        .email-body {
                            padding: 20px;
                            text-align: center;
                        }
                        .email-footer {
                            font-size: 12px;
                            text-align: center;
                            padding: 20px;
                            color: #aaaaaa;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="email-header">
                            <h2>Wise Waste!</h2>
                        </div>
                        <div class="email-body">
                            <p>Your request has been <strong>Rejected</strong> by the Admin.</p>
                        </div>
                        <div class="email-footer">
                            If you believe this is a mistake, please contact support.
                        </div>
                    </div>
                </body>
                </html>
                `,
      };
      await sendEmail(mailOptionsUser);
    } else {
      // throw Error("User with the provided email already exists");
      res.json({
        success: false,
        message:
          "Error come in Rejected part of verified email by adimn of user",
      });
    }
    // res.json({ success: true, message: 'User is Rejected by the admin.' });
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Helvetica Neue', Helvetica, Arial, Poppins, sans-serif;
                background-color: #f7f7f7;
                margin: 0;
                padding: 0;
                color: #555555;
            }
            .email-container {
                max-width: 600px;
                margin: auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 4px;
                box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
            }
            .email-header {
                background-color: #243727;
                color: #ffffff;
                padding: 10px 20px;
                text-align: center;
                border-radius: 4px 4px 0 0;
            }
            .email-body {
                padding: 20px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                <h2>Wise Waste!</h2>
            </div>
            <div class="email-body">
                <h2>Request Rejected!</h2>
                <p>Request is Rejected by the admin for <strong>${emailID}</strong>.</p>
            </div>
        </div>
    </body>
    </html>
    `);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.route("/managezoneget").get(async (req, res) => {
  const token = req.cookies.token;
  console.log("TOKENNNN from cookie magezoneget");
  console.log(token);
  try {
    const zone = await ManageZone.findOne();
    if (zone) {
      // Sort the zones array
      zone.zones.sort();
      res.json(zone);
    } else {
      res.status(404).json({ message: "No ManageZone document found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.route("/managezoneput").put(async (req, res) => {
  const token = req.cookies.token;
  console.log("TOKENNNN from cookie magezoneget");
  console.log(token);
  try {
    const { zones } = req.body;
    const updatedZone = await ManageZone.findOneAndUpdate(
      {},
      { zones },
      { new: true }
    );
    res.json(updatedZone);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.route("/getworkers").get(async (req, res) => {
  try {
    let query = {
      otpVerified: true,
      adminVerified: true,
      emailID: { $ne: ADMIN_EMAIL },
    };

    // Check if zoneAlloted is provided in the query parameters
    if (req.query.zoneAlloted) {
      query.zoneAlloted = req.query.zoneAlloted;
    }
    if (req.query.zoneAlloted === "Not Alloted Zones") {
      console.log("yes");
      query.zoneAlloted = "";
    }

    const workers = await User.find(query).sort({ fullName: 1 });
    res.json(workers);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

router.route("/allotzone").put(async (req, res) => {
  const { emailID } = req.query;
  const { zoneAlloted } = req.body;
  // console.log(emailID);
  // console.log(zoneAlloted);

  if (!emailID || !zoneAlloted) {
    return res.status(400).send("Email ID and new zone must be provided");
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { emailID: emailID },
      { zoneAlloted: zoneAlloted },
      { new: true } // Returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).send("Worker not found");
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.route("/handledeletezone").put(async (req, res) => {
  const zoneToBeDeleted = req.query.zonedeleted;
  const { zoneAlloted } = req.body;
  try {
    await User.updateMany(
      { zoneAlloted: zoneToBeDeleted },
      { $set: { zoneAlloted: zoneAlloted } }
    );
    res.status(200).send("Users updated successfully");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;

// code TO access Token from cookie
// const token = req.cookies.token;