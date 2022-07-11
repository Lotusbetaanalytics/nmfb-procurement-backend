const router = require("express").Router();
const ProjectOnboarding = require("../models/ProjectOnboarding");
const {
  populateProjectOnboarding,
  createProjectOnboarding,
  getAllProjectOnboardings,
  getProjectOnboarding,
  updateProjectOnboarding,
  deleteProjectOnboarding,
  // getAllStartedProjectOnboardings,
  // getAllTerminatedProjectOnboardings,
  // getAllPendingProjectOnboardings,
  // getAllCompletedProjectOnboardings,
  uploadProjectOnboardingDocuments,
  terminateProjectOnboarding,
  updateProjectOnboardingStatus,
} = require("../controllers/projectOnboarding");
const {verifyToken, authorize, hasPermission} = require("../middleware/auth");
const {multerUploadConfig} = require("../utils/fileUtils")
const advancedResults = require("../middleware/advancedResults");

router.post("/", verifyToken, hasPermission("CreateAndModifyProjectOnboarding"), createProjectOnboarding); // create a projectOnboarding
router.get("/", verifyToken, advancedResults(ProjectOnboarding, populateProjectOnboarding), getAllProjectOnboardings); // get all projectOnboardings
// router.get("/started", verifyToken, getAllStartedProjectOnboardings); // get all started projectOnboardings
// router.get("/terminated", verifyToken, getAllTerminatedProjectOnboardings); // get all terminated projectOnboardings
// router.get("/pending", verifyToken, getAllPendingProjectOnboardings); // get all pending projectOnboardings
// router.get("/completed", verifyToken, getAllCompletedProjectOnboardings); // get all completed projectOnboardings
router.get("/:id", verifyToken, getProjectOnboarding); // get projectOnboarding details by id
router.patch("/:id", verifyToken, hasPermission("CreateAndModifyProjectOnboarding"), updateProjectOnboarding); // update projectOnboarding details by id
router.delete("/:id", verifyToken, hasPermission("DeleteProjectOnboarding"), deleteProjectOnboarding); // delete projectOnboarding by id
router.get("/:id/terminate", verifyToken, terminateProjectOnboarding); // terminate projectOnboarding by id
router.patch("/:id/status", verifyToken, hasPermission("CreateAndModifyProjectOnboarding"), updateProjectOnboardingStatus); // update projectOnboarding status by id
router.patch("/:id/upload", verifyToken, hasPermission("CreateAndModifyProjectOnboarding"), multerUploadConfig, uploadProjectOnboardingDocuments); // upload projectOnboarding documents by id

module.exports = router;
