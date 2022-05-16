const mongoose = require("mongoose");

const ProjectTypeSchema = new mongoose.Schema({
  /**
   * • Services related
   * • Goods and work
   * • Contract Renewal
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

module.exports = mongoose.model("ProjectType", ProjectTypeSchema);
