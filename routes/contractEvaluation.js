const router = require("express").Router();
const ContractEvaluation = require("../models/ContractEvaluation");
const {
  createContractEvaluation,
  getAllContractEvaluation,
  getContractEvaluation,
  updateContractEvaluation,
  deleteContractEvaluation,
} = require("../controllers/contractEvaluation");
const {verifyToken} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.post("/", verifyToken, createContractEvaluation); // create a contractEvaluation
router.get("/", advancedResults(ContractEvaluation), getAllContractEvaluation); // get all contractEvaluation
router.get("/:id", verifyToken, getContractEvaluation); // get contractEvaluation details by id
router.patch("/:id", verifyToken, updateContractEvaluation); // update contractEvaluation details by id
router.delete("/:id", verifyToken, deleteContractEvaluation); // delete contractEvaluation by id

module.exports = router;
