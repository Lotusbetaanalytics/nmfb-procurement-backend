const mongoose = require("mongoose");
const slugify = require("slugify")

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
    required: true
  },
  description: {
    type: String,
  },
  slug: {
    type: String,
  },
  isUnique: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

RoleSchema.pre("save", async function (next) {
  this.slug = slugify(this.title)
});

module.exports = mongoose.model("Role", RoleSchema);
