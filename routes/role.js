const router = require("express").Router();
const Role = require("../models/Role");
const {createRole, getAllRoles, getRole, updateRole, deleteRole} = require("../controllers/role");
const {verifyToken} = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");


router.post("/", createRole); // create a role
router.get("/", advancedResults(Role), getAllRoles); // get all roles
router.get("/:id", verifyToken, getRole); // get role details by id
router.patch("/:id", verifyToken, updateRole); // update role details by id
router.delete("/:id", verifyToken, deleteRole); // delete role by id

module.exports = router;
