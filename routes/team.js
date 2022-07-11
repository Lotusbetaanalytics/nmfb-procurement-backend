const router = require("express").Router();
const Team = require("../models/Team");
const {
  populateTeam,
  createTeam,
  getAllTeams,
  getTeam,
  updateTeam,
  deleteTeam,
} = require("../controllers/team");
const {verifyToken, hasPermission} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.post("/", verifyToken, hasPermission("CreateAndModifyTeam"), createTeam); // create a team
router.get("/", advancedResults(Team, populateTeam), getAllTeams); // get all teams
router.get("/:id", verifyToken, getTeam); // get team details by id
router.patch("/:id", verifyToken, hasPermission("CreateAndModifyTeam"), updateTeam); // update team details by id
router.delete("/:id", verifyToken, hasPermission("DeleteTeam"), deleteTeam); // delete team by id

module.exports = router;
