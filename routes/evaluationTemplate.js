const router = require("express").Router();
const EvaluationTemplate = require("../models/EvaluationTemplate");
const {
  createEvaluationTemplate,
  getAllEvaluationTemplates,
  getEvaluationTemplate,
  updateEvaluationTemplate,
  deleteEvaluationTemplate,
} = require("../controllers/evaluationTemplate");
const {verifyToken, hasPermission} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.post("/", verifyToken, hasPermission("CreateAndModifyEvaluationTemplate"), createEvaluationTemplate); // create a evaluationTemplate
router.get("/", advancedResults(EvaluationTemplate), getAllEvaluationTemplates); // get all evaluationTemplate
router.get("/:id", verifyToken, getEvaluationTemplate); // get evaluationTemplate details by id
router.patch("/:id", verifyToken, hasPermission("CreateAndModifyEvaluationTemplate"), updateEvaluationTemplate); // update evaluationTemplate details by id
router.delete("/:id", verifyToken, hasPermission("DeleteEvaluationTemplate"), deleteEvaluationTemplate); // delete evaluationTemplate by id

module.exports = router;
