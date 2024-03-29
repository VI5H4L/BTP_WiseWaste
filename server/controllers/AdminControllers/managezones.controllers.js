const expressAsyncHandler = require("express-async-handler");
const { Dustbin } = require("../../models/dustbin.models");
const { User } = require("../../models/user.models");
const { ManageZone } = require("../../models/managezone.models");

const manageZoneGet = expressAsyncHandler(async (req, res) => {
  try {
    const zone = await ManageZone.findOne();
    if (zone) {
      // Sort the zones array
      zone.zones.sort();
      res.json(zone);
    } else {
      res.status(404).json({ message: "No ManageZone document found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
const manageZonePut = expressAsyncHandler(async (req, res) => {
  try {
    const { zones } = req.body;
    const updatedZone = await ManageZone.findOneAndUpdate(
      {},
      { zones },
      { new: true }
    );
    res.json(updatedZone);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
const handleDeleteZone = expressAsyncHandler(async (req, res) => {
  const zoneToBeDeleted = req.query.zonedeleted;
  const { zoneAlloted } = req.body;
  try {
    await User.updateMany(
      { zoneAlloted: zoneToBeDeleted },
      { $set: { zoneAlloted: zoneAlloted } }
    );

    // Delete documents in the Dustbin schema
    await Dustbin.deleteMany({ zone: zoneToBeDeleted });

    res.status(200).send("Users and dustbins updated successfully");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = { manageZoneGet, manageZonePut, handleDeleteZone };
