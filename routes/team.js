const router = require("express").Router();
const Team = require("../models/Team");
const {
  populateTeamDetails,
  createTeam,
  getAllTeams,
  getTeam,
  updateTeam,
  deleteTeam,
} = require("../controllers/team");
const {verifyToken} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.post("/", createTeam); // create a team
router.get("/", advancedResults(Team, populateTeamDetails), getAllTeams); // get all teams
router.get("/:id", verifyToken, getTeam); // get team details by id
router.patch("/:id", verifyToken, updateTeam); // update team details by id
router.delete("/:id", verifyToken, deleteTeam); // delete team by id

module.exports = router;
