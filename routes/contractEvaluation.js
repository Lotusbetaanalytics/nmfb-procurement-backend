const router = require("express").Router();
const ContractEvaluation = require("../models/ContractEvaluation");
const {
  populateContractEvaluation,
  createContractEvaluation,
  getAllContractEvaluations,
  getContractEvaluation,
  updateContractEvaluation,
  deleteContractEvaluation,
} = require("../controllers/contractEvaluation");
const {verifyToken, hasPermission} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.post("/", verifyToken, hasPermission("CreateAndModifyContractEvaluation"), createContractEvaluation); // create a contractEvaluation
router.get("/", advancedResults(ContractEvaluation, populateContractEvaluation), getAllContractEvaluations); // get all contractEvaluation
router.get("/:id", verifyToken, getContractEvaluation); // get contractEvaluation details by id
router.patch("/:id", verifyToken, hasPermission("CreateAndModifyContractEvaluation"), updateContractEvaluation); // update contractEvaluation details by id
router.delete("/:id", verifyToken, hasPermission("DeleteContractEvaluation"), deleteContractEvaluation); // delete contractEvaluation by id

module.exports = router;
