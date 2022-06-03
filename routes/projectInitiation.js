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
  // File upload controllers
  uploadProjectInitiationTechnicalSpecificationDocuments,
  uploadProjectInitiationCostEstimationDocuments,
  uploadProjectInitiationSelectionMethodDocuments,
  uploadProjectInitiationNoObjectionDocuments,
  uploadProjectInitiationIssuanceOfSPNDocuments,
  uploadProjectInitiationSubmissionOfProposalsDocuments,
  uploadProjectInitiationBidOpeningExerciseDocuments,
  uploadProjectInitiationBidEvaluationDocuments,
} = require("../controllers/projectInitiation");
const {verifyToken, authorize, hasPermission} = require("../middleware/auth");
const {multerUploadConfig} = require("../utils/fileUtils")
const advancedResults = require("../middleware/advancedResults");

router.post("/", verifyToken, hasPermission("CreateAndModifyProjectInitiation"), 
  // authorize("Super Admin", "Head of Procurement", "Frontdesk"), 
  createProjectInitiation); // create a projectInitiation
router.get("/", verifyToken, advancedResults(ProjectInitiation, populateProjectInitiationDetails), getAllProjectInitiations); // get all projectInitiations
router.get("/started", verifyToken, getAllStartedProjectInitiations); // get all projectInitiations
router.get("/terminated", verifyToken, getAllTerminatedProjectInitiations); // get all projectInitiations
router.get("/pending", verifyToken, getAllPendingProjectInitiations); // get all projectInitiations
router.get("/completed", verifyToken, getAllCompletedProjectInitiations); // get all projectInitiations
router.get("/approved", verifyToken, getAllApprovedProjectInitiations); // get all projectInitiations
router.get("/declined", verifyToken, getAllDeclinedProjectInitiations); // get all projectInitiations
router.get("/onHold", verifyToken, getAllOnHoldProjectInitiations); // get all projectInitiations
router.get("/:id", verifyToken, getProjectInitiation); // get projectInitiation details by id
router.patch("/:id", verifyToken, hasPermission("CreateAndModifyProjectInitiation"), 
  // authorize("Super Admin", "HOP", "Admin", "Front Desk Officer", "PDO"), 
  updateProjectInitiation); // update projectInitiation details by id
router.delete("/:id", verifyToken, hasPermission("DeleteProjectInitiation"), 
  // authorize("Super Admin", "HOP"), 
  deleteProjectInitiation); // delete projectInitiation by id
router.get("/:id/approve", verifyToken, approveProjectInitiation); // approve projectInitiation by id
router.get("/:id/decline", verifyToken, declineProjectInitiation); // approve projectInitiation by id
router.patch("/:id/status", verifyToken, hasPermission("CreateAndModifyProjectInitiation"), updateProjectInitiationStatus); // update projectInitiation status by id
router.patch("/:id/upload", verifyToken, hasPermission("CreateAndModifyProjectInitiation"), multerUploadConfig, uploadProjectInitiationDocuments); // upload projectInitiation documents by id
router.get("/:id/tasks", verifyToken, getProjectInitiationTasks); // get projectInitiation details by id
router.patch("/:id/assign", verifyToken, hasPermission("CreateAndModifyProjectInitiation"), assignProject); // assign project to responsible officer

router.patch("/:id/technicalSpecification", verifyToken, hasPermission("CreateAndModifyProjectInitiation"), multerUploadConfig, uploadProjectInitiationTechnicalSpecificationDocuments); // upload projectInitiation documents by id
router.patch("/:id/costEstimation", verifyToken, hasPermission("CreateAndModifyProjectInitiation"), multerUploadConfig, uploadProjectInitiationCostEstimationDocuments); // upload projectInitiation documents by id
router.patch("/:id/selectionMethod", verifyToken, hasPermission("CreateAndModifyProjectInitiation"), multerUploadConfig, uploadProjectInitiationSelectionMethodDocuments); // upload projectInitiation documents by id
router.patch("/:id/noObjection", verifyToken, hasPermission("CreateAndModifyProjectInitiation"), multerUploadConfig, uploadProjectInitiationNoObjectionDocuments); // upload projectInitiation documents by id
router.patch("/:id/issuanceOfSPN", verifyToken, hasPermission("CreateAndModifyProjectInitiation"), multerUploadConfig, uploadProjectInitiationIssuanceOfSPNDocuments); // upload projectInitiation documents by id
router.patch("/:id/submissionOfProposals", verifyToken, hasPermission("CreateAndModifyProjectInitiation"), multerUploadConfig, uploadProjectInitiationSubmissionOfProposalsDocuments); // upload projectInitiation documents by id
router.patch("/:id/bidOpeningExercise", verifyToken, hasPermission("CreateAndModifyProjectInitiation"), multerUploadConfig, uploadProjectInitiationBidOpeningExerciseDocuments); // upload projectInitiation documents by id
router.patch("/:id/bidEvaluation", verifyToken, hasPermission("CreateAndModifyProjectInitiation"), multerUploadConfig, uploadProjectInitiationBidEvaluationDocuments); // upload projectInitiation documents by id

module.exports = router;
