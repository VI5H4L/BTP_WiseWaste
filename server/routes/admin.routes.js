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

const verifyToken = require("../middleware/auth");


router.route("/approve").get(approveRequest);
router.route("/reject").get(rejectRequest);

router.route("/simulation").get(getSimulationData);
router.route("/simulation").post(postSimulationData);
router.route("/simulation").delete(delSimulationData);

router.route("/getworkers").get(getWorkers);
router.route("/allotzone").put(allotZone);

router.route("/managezoneget").get(verifyToken,manageZoneGet);
router.route("/managezoneput").put(manageZonePut);
router.route("/handledeletezone").put(handleDeleteZone);

module.exports = router;

// code TO access Token from cookie
// const token = req.cookies.token;
