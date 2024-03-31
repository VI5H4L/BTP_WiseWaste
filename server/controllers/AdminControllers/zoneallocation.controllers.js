const expressAsyncHandler = require("express-async-handler");
const { ADMIN_EMAIL } = process.env;
const { User } = require("../../models/user.models");
const sendEmail = require("../../utils/sendEmail");

const { ZONE_ALLOCATE_AUTH_EMAIL } = process.env;

const getWorkers = expressAsyncHandler(async (req, res) => {
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
const allotZone = expressAsyncHandler(async (req, res) => {
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

    // send email to user
    const mailOptionsUser = {
      from: ZONE_ALLOCATE_AUTH_EMAIL,
      to: emailID,
      subject: "Zone Allotment Information",
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
              .zone-info {
                  display: inline-block;
                  font-size: 16px;
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
                  <p>${
                    zoneAlloted !== "na"
                      ? `Zone Allotment for the ${emailID} is ${zoneAlloted}`
                      : `No zone has been allotted to ${emailID}`
                  }</p>
                  <div class="zone-info">${
                    zoneAlloted !== "na" ? zoneAlloted : "No Zone Allotted"
                  }</div>
              </div>
              <div class="email-footer">
                  For any queries, contact wisewaste.btp@gmail.com
              </div>
          </div>
      </body>
      </html>
        `,
    };
    await sendEmail(mailOptionsUser);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = { getWorkers, allotZone };
