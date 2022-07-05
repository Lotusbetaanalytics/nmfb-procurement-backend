const router = require("express").Router();
const {
  getAllLogs,
} = require("../controllers/log");
// const {verifyToken} = require("../middleware/auth");


router.get("/all", getAllLogs); // get all logs
router.get("", getAllLogs); // get all logs

module.exports = router;
