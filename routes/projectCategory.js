const router = require("express").Router();
const ProjectCategory = require("../models/ProjectCategory");
const {
  createProjectCategory,
  getAllProjectCategorys,
  getProjectCategory,
  updateProjectCategory,
  deleteProjectCategory,
} = require("../controllers/projectCategory");
const {verifyToken, hasPermission} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.post("/", verifyToken, hasPermission("CreateAndModifyProjectCategory"), createProjectCategory); // create a projectCategory
router.get("/", advancedResults(ProjectCategory), getAllProjectCategorys); // get all projectCategorys
router.get("/:id", verifyToken, getProjectCategory); // get projectCategory details by id
router.patch("/:id", verifyToken, hasPermission("CreateAndModifyProjectCategory"), updateProjectCategory); // update projectCategory details by id
router.delete("/:id", verifyToken, hasPermission("CreateAndModifyProjectCategory"), deleteProjectCategory); // delete projectCategory by id

module.exports = router;
