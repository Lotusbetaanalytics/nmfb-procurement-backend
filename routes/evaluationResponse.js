const router = require("express").Router();
const EvaluationResponse = require("../models/EvaluationResponse");
const {
  createEvaluationResponse,
  getAllEvaluationResponses,
  getEvaluationResponse,
  updateEvaluationResponse,
  deleteEvaluationResponse,
} = require("../controllers/evaluationResponse");
const {verifyToken} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.post("/", verifyToken, createEvaluationResponse); // create a evaluationResponse
router.get("/", advancedResults(EvaluationResponse), getAllEvaluationResponses); // get all evaluationResponse
router.get("/:id", verifyToken, getEvaluationResponse); // get evaluationResponse details by id
router.patch("/:id", verifyToken, updateEvaluationResponse); // update evaluationResponse details by id
router.delete("/:id", verifyToken, deleteEvaluationResponse); // delete evaluationResponse by id

module.exports = router;
