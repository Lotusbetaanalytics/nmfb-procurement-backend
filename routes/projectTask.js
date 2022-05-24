const router = require("express").Router();
const ProjectTask = require("../models/ProjectTask");
const {
  populateProjectTaskDetails,
  createProjectTask,
  getAllProjectTasks,
  getProjectTask,
  updateProjectTask,
  deleteProjectTask,
} = require("../controllers/projectTask");
const {verifyToken} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.post("/", verifyToken, createProjectTask); // create a projectTask
router.get("/", advancedResults(ProjectTask, populateProjectTaskDetails), getAllProjectTasks); // get all projectTasks
router.get("/:id", verifyToken, getProjectTask); // get projectTask details by id
router.patch("/:id", verifyToken, updateProjectTask); // update projectTask details by id
router.delete("/:id", verifyToken, deleteProjectTask); // delete projectTask by id

module.exports = router;
