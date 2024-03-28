const expressAsyncHandler = require("express-async-handler");
const { Dustbin } = require("../../models/dustbin.models");

const getSimulationData = expressAsyncHandler(async (req, res) => {
  try {
    const dustbins = await Dustbin.find().sort("dustbinID");
    res.json(dustbins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const postSimulationData = expressAsyncHandler(async (req, res) => {
  const { dustbinID, percentage, zone } = req.body;

  // Validate the request body
  if (!dustbinID || !percentage || !zone) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Check if a dustbin with the same ID already exists
    const existingDustbin = await Dustbin.findOne({ dustbinID });
    if (existingDustbin) {
      return res
        .status(400)
        .json({ message: "A dustbin with this ID already exists" });
    }

    // Create a new dustbin
    const dustbin = new Dustbin({ dustbinID, percentage, zone });
    const newDustbin = await dustbin.save();

    res.status(201).json(newDustbin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const delSimulationData = expressAsyncHandler(async (req, res) => {
  const { dustbinID } = req.query;

  // Check if dustbinID is provided
  if (!dustbinID) {
    return res
      .status(400)
      .json({ error: "Missing dustbinID in query parameters" });
  }

  try {
    // Find the dustbin by dustbinID and delete it
    const deletedDustbin = await Dustbin.findOneAndDelete({ dustbinID });

    // If no dustbin found, send an error message
    if (!deletedDustbin) {
      return res
        .status(404)
        .json({ error: "No dustbin found with the provided dustbinID" });
    }

    // If dustbin is deleted successfully, send a success message
    res.json({ message: "Dustbin deleted successfully", deletedDustbin });
  } catch (error) {
    // If there is an error while deleting the dustbin, send an error message
    res
      .status(500)
      .json({ error: "An error occurred while deleting the dustbin" });
  }
});

module.exports = { postSimulationData, getSimulationData, delSimulationData };
