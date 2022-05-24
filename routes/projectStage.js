const router = require("express").Router();
const ProjectStage = require("../models/ProjectStage");
const {
  createProjectStage,
  getAllProjectStages,
  getProjectStage,
  updateProjectStage,
  deleteProjectStage,
} = require("../controllers/projectStage");
const {verifyToken} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.post("/", verifyToken, createProjectStage); // create a projectStage
router.get("/", advancedResults(ProjectStage), getAllProjectStages); // get all projectStages
router.get("/:id", verifyToken, getProjectStage); // get projectStage details by id
router.patch("/:id", verifyToken, updateProjectStage); // update projectStage details by id
router.delete("/:id", verifyToken, deleteProjectStage); // delete projectStage by id

module.exports = router;
