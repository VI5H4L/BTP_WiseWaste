const express = require("express");
const router = express.Router();

const {
  verifyEmail,
  verifyUserEmail,
} = require("../controllers/emailVerify.controllers");

const sendEmail = require("../utils/sendEmail");

const { REQUESTS_AUTH_EMAIL, ADMIN_EMAIL, LOCALHOST } = process.env;

router.route("/email_verify").post(async (req, res) => {
  try {
    let { emailID } = req.body;

    const createdEmailVerificationOTP = await verifyEmail({ emailID });

    res.status(200).json(createdEmailVerificationOTP);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.route("/verify_email").post(async (req, res) => {
  try {
    console.log("success 11");
    let { emailID, otp } = req.body;
    console.log("success 21");
    if (!(emailID && otp)) {
      throw Error("Empty otp details are not allowed");
      // res.json({ success: false, message: 'Empty otp details are not allowed' });
    }
    console.log("success 31");
    await verifyUserEmail({ emailID, otp });

    let approvalLink = `${LOCALHOST}/admin/approve?emailID=${emailID}`;
    let rejectLink = `${LOCALHOST}/admin/reject?emailID=${emailID}`;

    // send email to Admin
    const mailOptionsUser = {
      from: REQUESTS_AUTH_EMAIL,
      to: ADMIN_EMAIL,
      subject: `${emailID} : Worker Approval Request`,
      //   html: `A new worker has registered. <a href="${approvalLink}">Approve</a> or <a href="${rejectLink}">Reject</a>.`,
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
            .action-links {
                margin: 20px 0;
            }
            .anchor {
                text-decoration: none;
                color: #465775;
                background-color: #f7f7f7;
                border: 1px solid #465775;
                padding: 10px 15px;
                border-radius: 4px;
                font-weight: bold;
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
                <p>A new worker : ${emailID} has registered.</p>
                <div class="action-links">
                    <a class="anchor" href="${approvalLink}">Approve</a> or 
                    <a class="anchor" href="${rejectLink}">Reject</a>
                </div>
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

    console.log(mailOptionsUser);
    console.log("success 41");
    res.status(200).json({ success: true, emailID, verified: true });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
