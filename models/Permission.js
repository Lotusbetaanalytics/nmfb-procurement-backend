const mongoose = require("mongoose");
const slugify = require("slugify")

const PermissionSchema = new mongoose.Schema({

  title: {
    type: String,
    unique: true,
    required: true,
  },
  value: {
    type: Boolean,
    default: true,
    required: true,
  },
  slug: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

PermissionSchema.pre("save", async function (next) {
  if (!this.slug)
    this.slug = slugify(this.title, "")
});

module.exports = mongoose.model("Permission", PermissionSchema);
