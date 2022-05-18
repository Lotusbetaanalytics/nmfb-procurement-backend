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

router.post("/", verifyToken, authorize("Super Admin", "HOP"), createProjectInitiation); // create a projectInitiation
router.get("/", verifyToken, advancedResults(ProjectInitiation), getAllProjectInitiations); // get all projectInitiations
router.get("/:id", verifyToken, getProjectInitiation); // get projectInitiation details by id
router.patch("/:id", verifyToken, authorize("Super Admin", "HOP", "Admin", "Front Desk Officer", "PDO"), updateProjectInitiation); // update projectInitiation details by id
router.delete("/:id", verifyToken, authorize("Super Admin", "HOP"), deleteProjectInitiation); // delete projectInitiation by id

module.exports = router;
