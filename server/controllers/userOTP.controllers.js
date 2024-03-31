const expressAsyncHandler = require("express-async-handler");
const express = require("express");

const { OTP } = require("../models/user.models");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const { hashData, verifyHashedData } = require("../utils/hashPassword");

const { OTP_AUTH_EMAIL } = process.env;

const newOTPGenerator = expressAsyncHandler(
  async ({ emailID, subject, message, duration = 1 }) => {
    try {
      if (!(emailID && subject && message)) {
        throw Error("Provide values for email, subject, message");
      }

      // clear any old record
      await OTP.deleteOne({ emailID });

      //generate pin
      const generatedOTP = await generateOTP();
      console.log(generatedOTP);

      // send email to user
      const mailOptionsUser = {
        from: OTP_AUTH_EMAIL,
        to: emailID,
        subject,
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: 'Helvetica Neue', Helvetica, Arial,Poppins, sans-serif;
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
                .otp-code {
                    display: inline-block;
                    font-size: 20px;
                    color: #465775;
                    border: 1px solid #465775;
                    padding: 10px 15px;
                    margin: 20px 0;
                    border-radius: 4px;
                    background-color: #f7f7f7;
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
                    <p>${message}</p>
                    <div class="otp-code">${generatedOTP}</div>
                    <p>This code expires in <strong>${duration}</strong> hour(s).</p>
                </div>
                <div class="email-footer">
                    If you did not request this code, please ignore this email.
                </div>
            </div>
        </body>
        </html>
    `,
      };
      console.log("success 1");

      await sendEmail(mailOptionsUser);
      console.log("success 2");
      // save otp record
      const hashedOTP = await hashData(generatedOTP);
      const newOTP = await new OTP({
        emailID,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000 * +duration,
      });

      const createdOTPRecord = await newOTP.save();
      return createdOTPRecord;
    } catch (error) {
      throw error;
    }
  }
);

const verifyOTPGenerated = expressAsyncHandler(async ({ emailID, otp }) => {
  try {
    if (!(emailID && otp)) {
      throw Error("Provide values for email, otp");
    }

    // ensure otp record exists
    const matchedOTPRecord = await OTP.findOne({ emailID });

    if (!matchedOTPRecord) {
      throw Error("No otp records found.");
    }

    const { expiresAt } = matchedOTPRecord;

    // checking for expired code
    if (expiresAt < Date.now()) {
      await OTP.deleteOne({ emailID });
      throw Error("Code has expired. Request for a new one.");
    }

    // not expired yet, verify value
    const hashedOTP = matchedOTPRecord.otp;
    const validOTP = await verifyHashedData(otp, hashedOTP);

    return validOTP;
  } catch (error) {
    throw error;
  }
});

const deleteOTP = expressAsyncHandler(async ({ emailID }) => {
  try {
    await OTP.deleteOne({ emailID });
  } catch (error) {
    throw error;
  }
});

module.exports = { newOTPGenerator, verifyOTPGenerated, deleteOTP };