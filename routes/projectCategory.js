const router = require("express").Router();
const ProjectCategory = require("../models/ProjectCategory");
const {
  createProjectCategory,
  getAllProjectCategorys,
  getProjectCategory,
  updateProjectCategory,
  deleteProjectCategory,
} = require("../controllers/projectCategory");
const {verifyToken} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.post("/", verifyToken, createProjectCategory); // create a projectCategory
router.get("/", advancedResults(ProjectCategory), getAllProjectCategorys); // get all projectCategorys
router.get("/:id", verifyToken, getProjectCategory); // get projectCategory details by id
router.patch("/:id", verifyToken, updateProjectCategory); // update projectCategory details by id
router.delete("/:id", verifyToken, deleteProjectCategory); // delete projectCategory by id

module.exports = router;
