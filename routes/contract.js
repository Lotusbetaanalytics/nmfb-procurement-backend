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
router.get("/:id", verifyToken, getContract); // get contract details by id
router.patch("/:id", verifyToken, updateContract); // update contract details by id
router.delete("/:id", verifyToken, deleteContract); // delete contract by id
router.get("/:id/terminate", verifyToken, terminateContract); // create a contract
router.get("/active", verifyToken, getAllActiveContracts); // create a contract
router.get("/terminated", verifyToken, getAllTerminatedContracts); // create a contract
router.get("/failed", verifyToken, getAllFailedContracts); // create a contract

module.exports = router;
