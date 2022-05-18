const router = require("express").Router();
const ProjectInitiation = require("../models/ProjectInitiation");
const {
  createProjectInitiation,
  getAllProjectInitiations,
  getProjectInitiation,
  updateProjectInitiation,
  deleteProjectInitiation,
} = require("../controllers/projectInitiation");
const {verifyToken, authorize} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.post("/", verifyToken, createProjectInitiation); // create a projectInitiation
router.get("/", verifyToken, advancedResults(ProjectInitiation), getAllProjectInitiations); // get all projectInitiations
router.get("/:id", verifyToken, getProjectInitiation); // get projectInitiation details by id
router.patch("/:id", verifyToken, updateProjectInitiation); // update projectInitiation details by id
router.delete("/:id", verifyToken, deleteProjectInitiation); // delete projectInitiation by id

module.exports = router;
