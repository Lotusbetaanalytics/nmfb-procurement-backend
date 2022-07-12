const router = require("express").Router();
const ProjectTask = require("../models/ProjectTask");
const {
  populateProjectTask,
  createProjectTask,
  getAllProjectTasks,
  getProjectTask,
  updateProjectTask,
  deleteProjectTask,
} = require("../controllers/projectTask");
const {verifyToken, hasPermission} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");


router.post("/", verifyToken, hasPermission("CreateAndModifyProjecTask"), createProjectTask); // create a projectTask
router.get("/", advancedResults(ProjectTask, populateProjectTask), getAllProjectTasks); // get all projectTasks
router.get("/:id", verifyToken, getProjectTask); // get projectTask details by id
router.patch("/:id", verifyToken, hasPermission("DeleteProjecTask"), updateProjectTask); // update projectTask details by id
router.delete("/:id", verifyToken, hasPermission("CreateAndModifyProjecTask"), deleteProjectTask); // delete projectTask by id

module.exports = router;
