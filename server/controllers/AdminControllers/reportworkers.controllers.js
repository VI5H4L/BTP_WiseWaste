const expressAsyncHandler = require("express-async-handler");
const { FillThresholds } = require("../../models/fillthresholds.models");
const { Dustbin } = require("../../models/dustbin.models");

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
      filledZones,zoneCounts,message: "No zones are currently filled based on the set thresholds.",
    });
  }

  // Return the filled zones and their detailed counts and percentages
  res.json({ filledZones, zoneCounts });
});

module.exports = { getThresholds, setThresholds, getFilledZones };
