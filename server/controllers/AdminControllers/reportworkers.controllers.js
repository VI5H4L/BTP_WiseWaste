const expressAsyncHandler = require("express-async-handler");
const { FillThresholds } = require("../../models/fillthresholds.models");

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
      if (dustbinFillThreshold < 0 || dustbinFillThreshold > 100 || zoneFillThreshold < 0 || zoneFillThreshold > 100) {
        return res.status(400).json({ message: "Thresholds must be between 0 and 100" });
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
  

module.exports = { getThresholds,setThresholds };
