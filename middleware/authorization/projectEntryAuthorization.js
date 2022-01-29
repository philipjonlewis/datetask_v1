const { asyncHandler } = require('../asyncHandler');
const ErrorHandler = require('../errorHandler');

const Project = require('../../models/modelSchema/ProjectModelSchema');

exports.projectEntryAuthorization = asyncHandler(async (req, res, next) => {
	const { projectName, natureOfProject } = req.body;

	const project = await Project.exists({
		user: req.user._id,
		projectName,
		natureOfProject,
	});

	if (project) {
		throw new ErrorHandler(400);
	}

	return next();
});
