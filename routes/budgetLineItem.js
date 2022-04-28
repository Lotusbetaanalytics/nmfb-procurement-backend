const router = require("express").Router();
const BudgetLineItem = require("../models/BudgetLineItem");
const {
  createBudgetLineItem,
  getAllBudgetLineItems,
  getBudgetLineItem,
  updateBudgetLineItem,
  deleteBudgetLineItem,
} = require("../controllers/budgetLineItem");
const {verifyToken} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.post("/", verifyToken, createBudgetLineItem); // create a budgetLineItem
router.get("/", advancedResults(BudgetLineItem), getAllBudgetLineItems); // get all budgetLineItems
router.get("/:id", verifyToken, getBudgetLineItem); // get budgetLineItem details by id
router.patch("/:id", verifyToken, updateBudgetLineItem); // update budgetLineItem details by id
router.delete("/:id", verifyToken, deleteBudgetLineItem); // delete budgetLineItem by id

module.exports = router;
