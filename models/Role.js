const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  /**
   * enum: ["HR", "Admin", "Head", "Manager", "Team Head", "Team Lead", "Staff"],
   * default: "Staff",
   */
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Role", RoleSchema);
