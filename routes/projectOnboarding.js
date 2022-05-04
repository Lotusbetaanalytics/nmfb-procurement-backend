const router = require("express").Router();
const ProjectOnboarding = require("../models/ProjectOnboarding");
const {
  createProjectOnboarding,
  getAllProjectOnboardings,
  getProjectOnboarding,
  updateProjectOnboarding,
  deleteProjectOnboarding,
} = require("../controllers/projectOnboarding");
const {verifyToken, authorize} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.post("/", verifyToken, authorize("Super Admin", "HOP", "PDO"), createProjectOnboarding); // create a projectOnboarding
router.get("/", verifyToken, advancedResults(ProjectOnboarding), getAllProjectOnboardings); // get all projectOnboardings
router.get("/:id", verifyToken, getProjectOnboarding); // get projectOnboarding details by id
router.patch("/:id", verifyToken, authorize("Super Admin", "HOP", "PDO"), updateProjectOnboarding); // update projectOnboarding details by id
router.delete("/:id", verifyToken, authorize("Super Admin", "HOP", "PDO"), deleteProjectOnboarding); // delete projectOnboarding by id

module.exports = router;
