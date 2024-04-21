const expressAsyncHandler = require("express-async-handler");
const { Dustbin } = require("../models/dustbin.models");
const axios = require("axios");

const { THINGSPEAK_LINK } = process.env;

const updateDustbinFromThingSpeak = expressAsyncHandler(
  async (req, res, next) => {
    try {
      const response = await axios.get(THINGSPEAK_LINK);
      console.log(response.data);
      const percentage = parseInt(response.data.feeds[0].field1);
      console.log(percentage);
      const dustbin = await Dustbin.findOne({ dustbinID: "IDTG11" });
      if (dustbin) {
        dustbin.percentage = percentage;
        dustbin.zone = "Zone X";
        await dustbin.save();
      } else {
        const newDustbin = new Dustbin({
          dustbinID: "IDTG11",
          percentage: 0, // or any value you want
          zone: "Zone X",
        });
        await newDustbin.save();
      }
      next();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

const getDustbinStatus = expressAsyncHandler(async (req, res) => {
  try {
    const dustbins = await Dustbin.find().sort("zone");
    res.json(dustbins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = { getDustbinStatus, updateDustbinFromThingSpeak };
