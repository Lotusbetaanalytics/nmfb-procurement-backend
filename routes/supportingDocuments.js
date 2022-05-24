const router = require("express").Router();
const SupportingDocuments = require("../models/SupportingDocuments");
const {
  populateSupportingDocumentsDetails,
  createSupportingDocuments,
  getAllSupportingDocuments,
  getSupportingDocuments,
  updateSupportingDocuments,
  deleteSupportingDocuments,
} = require("../controllers/supportingDocuments");
const {verifyToken} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.post("/", verifyToken, createSupportingDocuments); // create a supportingDocuments
router.get("/", advancedResults(SupportingDocuments, populateSupportingDocumentsDetails), getAllSupportingDocuments); // get all supportingDocumentss
router.get("/:id", verifyToken, getSupportingDocuments); // get supportingDocuments details by id
router.patch("/:id", verifyToken, updateSupportingDocuments); // update supportingDocuments details by id
router.delete("/:id", verifyToken, deleteSupportingDocuments); // delete supportingDocuments by id

module.exports = router;
