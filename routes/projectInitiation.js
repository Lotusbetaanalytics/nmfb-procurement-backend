const router = require("express").Router();
const ProjectInitiation = require("../models/ProjectInitiation");
const {
  populateProjectInitiationDetails,
  assignProject,
  createProjectInitiation,
  getAllProjectInitiations,
  getProjectInitiation,
  updateProjectInitiation,
  deleteProjectInitiation,
  approveProjectInitiation,
  declineProjectInitiation,
  updateProjectInitiationStatus,
  uploadProjectInitiationDocuments,
  getProjectInitiationTasks,
  getAllStartedProjectInitiations,
  getAllTerminatedProjectInitiations,
  getAllPendingProjectInitiations,
  getAllCompletedProjectInitiations,
  getAllApprovedProjectInitiations,
  getAllDeclinedProjectInitiations,
  getAllOnHoldProjectInitiations,
} = require("../controllers/projectInitiation");
const {verifyToken, authorize} = require("../middleware/auth");
const {multerUploadConfig} = require("../utils/fileUtils")
const advancedResults = require("../middleware/advancedResults");

router.post("/", verifyToken, authorize("Super Admin", "HOP"), createProjectInitiation); // create a projectInitiation
router.get("/", verifyToken, advancedResults(ProjectInitiation, populateProjectInitiationDetails), getAllProjectInitiations); // get all projectInitiations
router.get("/started", verifyToken, getAllStartedProjectInitiations); // get all projectInitiations
router.get("/terminated", verifyToken, getAllTerminatedProjectInitiations); // get all projectInitiations
router.get("/pending", verifyToken, getAllPendingProjectInitiations); // get all projectInitiations
router.get("/completed", verifyToken, getAllCompletedProjectInitiations); // get all projectInitiations
router.get("/approved", verifyToken, getAllApprovedProjectInitiations); // get all projectInitiations
router.get("/declined", verifyToken, getAllDeclinedProjectInitiations); // get all projectInitiations
router.get("/onHold", verifyToken, getAllOnHoldProjectInitiations); // get all projectInitiations
router.get("/:id", verifyToken, getProjectInitiation); // get projectInitiation details by id
router.patch("/:id", verifyToken, authorize("Super Admin", "HOP", "Admin", "Front Desk Officer", "PDO"), updateProjectInitiation); // update projectInitiation details by id
router.delete("/:id", verifyToken, authorize("Super Admin", "HOP"), deleteProjectInitiation); // delete projectInitiation by id
router.get("/:id/approve", verifyToken, approveProjectInitiation); // approve projectInitiation by id
router.get("/:id/decline", verifyToken, declineProjectInitiation); // approve projectInitiation by id
router.patch("/:id/status", verifyToken, updateProjectInitiationStatus); // update projectInitiation status by id
router.patch("/:id/upload", verifyToken, multerUploadConfig, uploadProjectInitiationDocuments); // upload projectInitiation documents by id
router.get("/:id/tasks", verifyToken, getProjectInitiationTasks); // get projectInitiation details by id
router.patch("/:id/assign", verifyToken, assignProject); // assign project to responsible officer

module.exports = router;
