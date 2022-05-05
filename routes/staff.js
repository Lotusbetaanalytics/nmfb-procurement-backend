const router = require("express").Router();
const Staff = require("../models/Staff");
const {
  // createStaff,
  getAllStaffs,
  getStaff,
  updateStaff,
  deleteStaff,
} = require("../controllers/staff");
const {verifyToken} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.post("/", createStaff); // create a staff
router.get("/", advancedResults(Staff), getAllStaffs); // get all staffs
router.get("/:id", verifyToken, getStaff); // get staff details by id
router.patch("/:id", verifyToken, updateStaff); // update staff details by id
router.delete("/:id", verifyToken, deleteStaff); // delete staff by id

module.exports = router;
