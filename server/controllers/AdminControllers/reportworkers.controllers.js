const expressAsyncHandler = require("express-async-handler");
const { FillThresholds } = require("../../models/fillthresholds.models");
const { Dustbin } = require("../../models/dustbin.models");
const { User } = require("../../models/user.models");
const sendEmail = require("../../utils/sendEmail");
const { ZONE_REPORTING_AUTH_EMAIL,TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN } = process.env;

const twilio = require('twilio');
const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const sendSMS = async (body, to) => {
  try {
      await client.messages.create({
          body: body,
          to: to,  // User's phone number
          from: "+13342768479" // Your Twilio number
      });
      console.log("Message sent");
  } catch (error) {
      console.error(error);
  }
};

const getThresholds = expressAsyncHandler(async (req, res) => {
  try {
    const thresholds = await FillThresholds.findOne({ id: 1 });
    if (!thresholds) {
      return res.status(404).json({ message: "No thresholds found" });
    }
    res.json(thresholds);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

const setThresholds = expressAsyncHandler(async (req, res) => {
  try {
    const { dustbinFillThreshold, zoneFillThreshold } = req.body;
    if (
      dustbinFillThreshold < 0 ||
      dustbinFillThreshold > 100 ||
      zoneFillThreshold < 0 ||
      zoneFillThreshold > 100
    ) {
      return res
        .status(400)
        .json({ message: "Thresholds must be between 0 and 100" });
    }
    const thresholds = await FillThresholds.findOneAndUpdate(
      { id: 1 },
      { dustbinFillThreshold, zoneFillThreshold },
      { new: true }
    );
    if (!thresholds) {
      return res.status(404).json({ message: "No thresholds found to update" });
    }
    res.json(thresholds);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

const getFilledZones = expressAsyncHandler(async (req, res) => {
  const thresholds = await FillThresholds.findOne();

  // Check if thresholds document exists
  if (!thresholds) {
    return res.status(404).json({ message: "Thresholds not set." });
  }

  // Edge case handling: Ensure thresholds are within the expected range
  if (
    thresholds.dustbinFillThreshold < 0 ||
    thresholds.dustbinFillThreshold > 100 ||
    thresholds.zoneFillThreshold < 0 ||
    thresholds.zoneFillThreshold > 100
  ) {
    return res
      .status(400)
      .json({ message: "Thresholds must be between 0 and 100." });
  }

  const dustbins = await Dustbin.find();

  // Enhanced zoneCounts with percentageFilled
  const zoneCounts = dustbins.reduce((acc, { zone, percentage }) => {
    if (!acc[zone]) acc[zone] = { total: 0, filled: 0, percentageFilled: 0 };
    acc[zone].total++;
    if (percentage >= thresholds.dustbinFillThreshold) acc[zone].filled++;
    // Calculate the percentage filled for the zone
    acc[zone].percentageFilled = (acc[zone].filled / acc[zone].total) * 100;
    return acc;
  }, {});

  // Filter zones based on the percentageFilled compared to zoneFillThreshold
  const filledZones = Object.keys(zoneCounts).filter(
    (zone) => zoneCounts[zone].percentageFilled >= thresholds.zoneFillThreshold
  );

  // If no zones meet the fill criteria, return a message indicating so.
  if (filledZones.length === 0) {
    return res.json({
      filledZones,
      zoneCounts,
      message: "No zones are currently filled based on the set thresholds.",
    });
  }

  // Return the filled zones and their detailed counts and percentages
  res.json({ filledZones, zoneCounts });
});

const reportWorkersOfZone = expressAsyncHandler(async (req, res) => {
  const { zone } = req.body;

  try {
    const workers = await User.find({ zoneAlloted: zone, role: "worker" });

    if (workers.length === 0) {
      return res
        .status(404)
        .json({ message: `No workers are allotted to zone ${zone}` });
    }

    const mailOptions = {
      from: ZONE_REPORTING_AUTH_EMAIL,
      subject: `Clean Zone: ${zone}`,
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
                  <p>Zone: ${zone} is filled and it should be cleaned.</p>
                  <div class="zone-info">${zone}</div>
              </div>
              <div class="email-footer">
                  For any queries, contact wisewaste.btp@gmail.com
              </div>
          </div>
      </body>
      </html>
      `,
    };

    workers.forEach(async (worker) => {
      mailOptions.to = worker.emailID;
      await sendEmail(mailOptions);
    });

    // sendSMS(`Emails sent to workers of zone ${zone}`,"+919205734004");
    res.status(200).json({ message: `Emails sent to workers of zone ${zone}` });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = {
  getThresholds,
  setThresholds,
  getFilledZones,
  reportWorkersOfZone,
};
