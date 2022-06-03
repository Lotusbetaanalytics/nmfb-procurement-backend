const router = require("express").Router();
const Permission = require("../models/Permission");
const {
  createPermission,
  getAllPermissions,
  getPermission,
  updatePermission,
  deletePermission,
} = require("../controllers/permission");
const {verifyToken, hasPermission} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.post("/", verifyToken, hasPermission("CreateAndModifyPermission"), createPermission); // create a permission
router.get("/", advancedResults(Permission), getAllPermissions); // get all permissions
router.get("/:id", verifyToken, getPermission); // get permission details by id
router.patch("/:id", verifyToken, hasPermission("CreateAndModifyPermission"), updatePermission); // update permission details by id
router.delete("/:id", verifyToken, hasPermission("DeletePermission"), deletePermission); // delete permission by id

module.exports = router;
