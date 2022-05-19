const asyncHandler = require("../middleware/async");
const ProjectType = require("../models/ProjectType");
const {token} = require("./scripts");


exports.generateProjectId = asyncHandler(async project => {
  try {
    const projectType = await ProjectType.findById(project.projectType);
    const projectId = `${projectType.title}-${project.title}-${token(10)}`;
    return projectId;
  } catch (err) {
    console.log(err.message);
    return null;
  }
});
