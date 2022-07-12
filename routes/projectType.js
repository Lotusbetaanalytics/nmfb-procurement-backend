const router = require("express").Router();
const ProjectType = require("../models/ProjectType");
const {
  createProjectType,
  getAllProjectTypes,
  getProjectType,
  updateProjectType,
  deleteProjectType,
} = require("../controllers/projectType");
const {verifyToken, hasPermission} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");


router.post("/", verifyToken, hasPermission("CreateAndModifyProjectType"), createProjectType); // create a projectType
router.get("/", advancedResults(ProjectType), getAllProjectTypes); // get all projectTypes
router.get("/:id", verifyToken, getProjectType); // get projectType details by id
router.patch("/:id", verifyToken, hasPermission("DeleteProjectType"), updateProjectType); // update projectType details by id
router.delete("/:id", verifyToken, hasPermission("CreateAndModifyProjectType"), deleteProjectType); // delete projectType by id

module.exports = router;
