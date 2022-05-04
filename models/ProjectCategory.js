const mongoose = require("mongoose");

const ProjectCategorySchema = new mongoose.Schema({
    /**
   * • A
   * • B
   * • C
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

module.exports = mongoose.model("ProjectCategory", ProjectCategorySchema);
