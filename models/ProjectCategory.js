const mongoose = require("mongoose");

const ProjectCategorySchema = new mongoose.Schema({
    /**
   * • A (MD) - managing director
   * • B (ED) - executive director
   * • C (HOP)
   * 
   * OR
   * 
   * a. Goods related project 
   * b. Services /consultancy related projects
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
