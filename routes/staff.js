const router = require("express").Router();
const Staff = require("../models/Staff");
const {
  populateStaff,
  createStaff,
  getAllStaffs,
  getStaff,
  updateStaff,
  deleteStaff,
  getTeamStaff,
  getRoleStaff,
  // getTeamHeads,
  // getPDOs,
  // getAdmins,
  // getHOP,
} = require("../controllers/staff");
const {verifyToken} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");


router.post("/", createStaff); // create a staff
router.get("/", advancedResults(Staff, populateStaff), getAllStaffs); // get all staffs
// router.get("/teamHead", verifyToken, getTeamHeads); // get all team heads
// router.get("/projectDeskOfficer", verifyToken, getPDOs); // get all project desk officers
// router.get("/frontDeskOfficer", verifyToken, getAdmins); // get all front desk officers
// router.get("/headOfProcurement", verifyToken, getHOP); // get head of procurement
router.get("/:id", verifyToken, getStaff); // get staff details by id
router.patch("/:id", verifyToken, updateStaff); // update staff details by id
router.delete("/:id", verifyToken, deleteStaff); // delete staff by id
router.get("/team/:id", verifyToken, getTeamStaff); // get staff details by team id
router.get("/role/:id", verifyToken, getRoleStaff); // get staff details by role id

module.exports = router;
