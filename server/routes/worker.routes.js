const express = require("express");
const router = express.Router();

const {
  getProfileData,
  updateProfileData,
  sendMaintenanceRequest
} = require("../controllers/WorkerControllers/worker.controllers");

const {verifyToken} = require("../middleware/auth");

router.route("/profile").get(verifyToken,getProfileData);
router.route("/profile").put(verifyToken,updateProfileData);

router.route("/maintenance-request").post(verifyToken,sendMaintenanceRequest);

module.exports = router;
