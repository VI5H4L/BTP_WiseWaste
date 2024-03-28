const expressAsyncHandler = require("express-async-handler");
const { Dustbin } = require("../models/dustbin.models");

const getDustbinStatus = expressAsyncHandler(async (req, res) => {
    try {
        const dustbins = await Dustbin.find().sort("zone");
        res.json(dustbins);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
});


module.exports = { getDustbinStatus };
