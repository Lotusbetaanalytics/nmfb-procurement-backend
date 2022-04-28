const router = require("express").Router();
const ContractType = require("../models/ContractType");
const {
  createContractType,
  getAllContractTypes,
  getContractType,
  updateContractType,
  deleteContractType,
} = require("../controllers/contractType");
const {verifyToken} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.post("/", verifyToken, createContractType); // create a contractType
router.get("/", advancedResults(ContractType), getAllContractTypes); // get all contractTypes
router.get("/:id", verifyToken, getContractType); // get contractType details by id
router.patch("/:id", verifyToken, updateContractType); // update contractType details by id
router.delete("/:id", verifyToken, deleteContractType); // delete contractType by id

module.exports = router;
