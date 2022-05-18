const router = require("express").Router();
const Contract = require("../models/Contract");
const {
  createContract,
  getAllContracts,
  getContract,
  updateContract,
  deleteContract,
  getAllActiveContracts,
  getAllTerminatedContracts,
  getAllFailedContracts,
  terminateContract,
} = require("../controllers/contract");
const {verifyToken} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.post("/", verifyToken, createContract); // create a contract
router.get("/", advancedResults(Contract), getAllContracts); // get all contracts
router.get("/active", verifyToken, getAllActiveContracts); // get all active contracts
router.get("/terminated", verifyToken, getAllTerminatedContracts); // get all terminated contracts
router.get("/failed", verifyToken, getAllFailedContracts); // get all failed contracts
router.get("/:id", verifyToken, getContract); // get contract details by id
router.patch("/:id", verifyToken, updateContract); // update contract details by id
router.delete("/:id", verifyToken, deleteContract); // delete contract by id
router.get("/:id/terminate", verifyToken, terminateContract); // create a contract

module.exports = router;
