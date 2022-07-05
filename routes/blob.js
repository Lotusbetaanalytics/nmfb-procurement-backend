const router = require("express").Router();
const Blob = require("../models/Blob");
const {
  populateBlobDetails,
  createBlob,
  getAllBlobs,
  getBlob,
  updateBlob,
  deleteBlob,
  deleteAllBlobs,
} = require("../controllers/blob");
const {verifyToken, hasPermission} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.post("/", createBlob); // create a blob
router.get("/", advancedResults(Blob, populateBlobDetails), getAllBlobs); // get all blobs
router.get("/:id", getBlob); // get blob details by id
router.patch("/:id", updateBlob); // update blob details by id
router.delete("/:id", deleteBlob); // delete blob by id
router.delete("", deleteAllBlobs); // delete all blobs

module.exports = router;
