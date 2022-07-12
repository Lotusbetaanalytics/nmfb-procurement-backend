const router = require("express").Router();
const Contract = require("../models/Contract");
const {
  populateContract,
  createContract,
  getAllContracts,
  getContract,
  updateContract,
  deleteContract,
  // getAllActiveContracts,
  // getAllTerminatedContracts,
  getAllFailedContracts,
  terminateContract,
} = require("../controllers/contract");
const {verifyToken, hasPermission} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");


router.post("/", verifyToken, hasPermission("CreateAndModifyContract"), createContract); // create a contract
router.get("/", advancedResults(Contract, populateContract), getAllContracts); // get all contracts
// router.get("/active", verifyToken, getAllActiveContracts); // get all active contracts
// router.get("/terminated", verifyToken, getAllTerminatedContracts); // get all terminated contracts
router.get("/failed", verifyToken, getAllFailedContracts); // get all failed contracts
router.get("/:id", verifyToken, getContract); // get contract details by id
router.patch("/:id", verifyToken, hasPermission("CreateAndModifyContract"), updateContract); // update contract details by id
router.delete("/:id", verifyToken, hasPermission("DeleteContract"), deleteContract); // delete contract by id
router.get("/:id/terminate", verifyToken, terminateContract); // create a contract

module.exports = router;
