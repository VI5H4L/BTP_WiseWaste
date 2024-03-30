const express = require("express");
const router = express.Router();

const {
  getProfileData,
  updateProfileData,
} = require("../controllers/WorkerControllers/profile.controllers");

const {verifyToken} = require("../middleware/auth");

router.route("/profile").get(verifyToken,getProfileData);
router.route("/profile").put(verifyToken,updateProfileData);

module.exports = router;
