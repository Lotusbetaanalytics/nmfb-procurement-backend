const router = require("express").Router();
const ContractType = require("../models/ContractType");
const {
  createContractType,
  getAllContractTypes,
  getContractType,
  updateContractType,
  deleteContractType,
} = require("../controllers/contractType");
const {verifyToken, hasPermission} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");


router.post("/", verifyToken, hasPermission("CreateAndModifyContractType"), createContractType); // create a contractType
router.get("/", advancedResults(ContractType), getAllContractTypes); // get all contractTypes
router.get("/:id", verifyToken, getContractType); // get contractType details by id
router.patch("/:id", verifyToken, hasPermission("CreateAndModifyContractType"), updateContractType); // update contractType details by id
router.delete("/:id", verifyToken, hasPermission("DeleteContractType"), deleteContractType); // delete contractType by id

module.exports = router;
