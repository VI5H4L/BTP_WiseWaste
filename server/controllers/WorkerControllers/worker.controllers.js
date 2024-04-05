const expressAsyncHandler = require("express-async-handler");
const { User } = require("../../models/user.models");
const { hashData } = require("../../utils/hashPassword");
const sendEmail = require("../../utils/sendEmail");
const {MAINTENANCE_AUTH_EMAIL,ADMIN_EMAIL} = process.env;
const getProfileData = expressAsyncHandler(async (req, res) => {
  const emailID = req.query.emailID;

  try {
    const user = await User.findOne({ emailID: emailID });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
const updateProfileData = expressAsyncHandler(async (req, res) => {
  const emailID = req.query.emailID;
  const phone = req.body.phone;
  if (phone != "9999999999") {
    try {
      const user = await User.findOneAndUpdate(
        { emailID: emailID },
        { phone: phone },
        {
          new: true,
        }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  const password = req.body.password;
  if (password != "") {
    try {
      if (password.length < 8) {
        res.json({ success: false, message: "Password is too short!" });
      } else {
        // hash password
        const hasedPassword = await hashData(password);
        const user = await User.findOneAndUpdate(
          { emailID: emailID },
          { password: hasedPassword },
          { new: true }
        );

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
  if (phone == "9999999999" && password == "") res.end();
});

const sendMaintenanceRequest = expressAsyncHandler(async (req, res) => {
  try {
    let { issueCategory, dustbinID, zone, urgency, description, reporterID } =
      req.body;

      description = description.replace(/\n/g, '<br>');

    const mailOptionsUser = {
      from: MAINTENANCE_AUTH_EMAIL,
      to: ADMIN_EMAIL,
      subject: `${reporterID} : Maintenance Request`,
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
                            <p>A new maintenance request has been created by ${reporterID}.</p>
                            <p>Issue Category: ${issueCategory}</p>
                            <p>Dustbin ID: ${dustbinID}</p>
                            <p>Zone: ${zone}</p>
                            <p>Urgency: ${urgency}</p>
                            <p>Description: ${description}</p>
                        </div>
                        <div class="email-footer">
                            If you did not request this action, please ignore this email.
                        </div>
                    </div>
                </body>
                </html>
        `,
    };

    await sendEmail(mailOptionsUser);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred.", error });
  }
});

module.exports = { getProfileData, updateProfileData, sendMaintenanceRequest };
