const router = require("express").Router();
const Permission = require("../models/Permission");
const {
  createPermission,
  getAllPermissions,
  getPermission,
  updatePermission,
  deletePermission,
} = require("../controllers/permission");
const {verifyToken} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

router.post("/", createPermission); // create a permission
router.get("/", advancedResults(Permission), getAllPermissions); // get all permissions
router.get("/:id", verifyToken, getPermission); // get permission details by id
router.patch("/:id", verifyToken, updatePermission); // update permission details by id
router.delete("/:id", verifyToken, deletePermission); // delete permission by id

module.exports = router;
