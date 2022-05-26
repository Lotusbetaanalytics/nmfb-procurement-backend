const router = require("express").Router();
const ProjectOnboarding = require("../models/ProjectOnboarding");
const {
  populateProjectOnboardingDetails,
  createProjectOnboarding,
  getAllProjectOnboardings,
  getProjectOnboarding,
  updateProjectOnboarding,
  deleteProjectOnboarding,
  getAllStartedProjectOnboardings,
  getAllTerminatedProjectOnboardings,
  uploadProjectOnboardingDocuments,
  getAllPendingProjectOnboardings,
  getAllCompletedProjectOnboardings,
  terminateProjectOnboarding,
  updateProjectOnboardingStatus,
} = require("../controllers/projectOnboarding");
const {verifyToken, authorize} = require("../middleware/auth");
const {multerUploadConfig} = require("../utils/fileUtils")
const advancedResults = require("../middleware/advancedResults");

router.post("/", verifyToken, createProjectOnboarding); // create a projectOnboarding
router.get("/", verifyToken, advancedResults(ProjectOnboarding, populateProjectOnboardingDetails), getAllProjectOnboardings); // get all projectOnboardings
router.get("/started", verifyToken, getAllStartedProjectOnboardings); // get all started projectOnboardings
router.get("/terminated", verifyToken, getAllTerminatedProjectOnboardings); // get all terminated projectOnboardings
router.get("/pending", verifyToken, getAllPendingProjectOnboardings); // get all pending projectOnboardings
router.get("/completed", verifyToken, getAllCompletedProjectOnboardings); // get all completed projectOnboardings
router.get("/:id", verifyToken, getProjectOnboarding); // get projectOnboarding details by id
router.patch("/:id", verifyToken, updateProjectOnboarding); // update projectOnboarding details by id
router.delete("/:id", verifyToken, deleteProjectOnboarding); // delete projectOnboarding by id
router.get("/:id/terminate", verifyToken, terminateProjectOnboarding); // terminate projectOnboarding by id
router.patch("/:id/status", verifyToken, updateProjectOnboardingStatus); // update projectOnboarding status by id
router.patch("/:id/upload", verifyToken, multerUploadConfig, uploadProjectOnboardingDocuments); // upload projectOnboarding documents by id

module.exports = router;
