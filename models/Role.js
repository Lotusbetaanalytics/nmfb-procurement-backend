const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  /**
   * enum: ["HR", "Admin", "Head", "Manager", "Team Head", "Team Lead", "Staff"],
   * default: "Staff",
   */

  /**
   * Super Admin [Super Admin]
   * From the solution document:
   * • Head of procurement [HOP]
   * • Front office / admin [Admin] [Front Office]
   * • Project desk officer [PDO]
   */
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  is_unique: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Role", RoleSchema);
