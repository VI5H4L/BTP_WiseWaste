const express = require("express");
const router = express.Router();

const {
  getSimulationData,
  postSimulationData,
  delSimulationData,
} = require("../controllers/AdminControllers/simulation.controllers");

const {
  manageZoneGet,
  manageZonePut,
  handleDeleteZone,
} = require("../controllers/AdminControllers/managezones.controllers");
const {
  getWorkers,
  allotZone,
} = require("../controllers/AdminControllers/zoneallocation.controllers");
const {
  approveRequest,
  rejectRequest,
} = require("../controllers/AdminControllers/requests.controllers");

const {verifyAdminToken} = require("../middleware/auth");


router.route("/approve").get(approveRequest);
router.route("/reject").get(rejectRequest);

router.route("/simulation").get(verifyAdminToken,getSimulationData);
router.route("/simulation").post(verifyAdminToken,postSimulationData);
router.route("/simulation").delete(verifyAdminToken,delSimulationData);

router.route("/getworkers").get(verifyAdminToken,getWorkers);
router.route("/allotzone").put(verifyAdminToken,allotZone);

router.route("/managezoneget").get(verifyAdminToken,manageZoneGet);
router.route("/managezoneput").put(verifyAdminToken,manageZonePut);
router.route("/handledeletezone").put(verifyAdminToken,handleDeleteZone);

module.exports = router;

// code TO access Token from cookie
// const token = req.cookies.token;
