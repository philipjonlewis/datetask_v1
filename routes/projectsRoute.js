const express = require('express');
const router = express.Router();

const Project = require('../models/modelSchema/ProjectModelSchema');

const { asyncHandler } = require('../middleware/asyncHandler');
const ErrorHandler = require('../middleware/errorHandler');
const { lapsedTaskRunner } = require('../middleware/lapsedTaskRunner');

const {
	getResourceSuccess,
	resourceSuccessResponseWithCookie,
	deleteResourceSuccess,
} = require('../middleware/successHandler');

const cookieHandler = require('../middleware/cookieHandler');
const userAuthentication = require('../middleware/authentication/userAuthentication');

const {
	entryValidation,
} = require('../middleware/formValidations/entryValidation');
const {
	projectEntryAuthorization,
} = require('../middleware/authorization/projectEntryAuthorization');
const {
	resourceVerification,
} = require('../middleware/verification/resourceVerification');

const {
	deleteProject,
} = require('../middleware/cascadeDelete/deleteFunctions');

// Checks if cookies exist and if user is authorized
router.use(cookieHandler, userAuthentication);

router
	.route('/')
	// Get all projects
	.get(
		asyncHandler(async (req, res) => {
			try {
				lapsedTaskRunner(req);
				const allProjects = await Project.find({
					user: req.user._id,
					_id: { $in: req.user.projects },
				}).select('-user -updatedAt -createdAt -__v');
				await getResourceSuccess(res, allProjects);
			} catch (error) {
				throw new ErrorHandler(404);
			}
		})
	)
	// create a new project
	.post(
		// entryValidation - checks if data in valid format
		// projectEntryAuthorization - checks if project already exists in db.
		[entryValidation('project'), projectEntryAuthorization],
		asyncHandler(async (req, res) => {
			try {
				// gets data from body
				let {
					projectName,
					projectDescription,
					natureOfProject,
					dateOfDeadline,
					projectImage,
				} = req.body;

				// sets date of deadline for uniformity
				dateOfDeadline = new Date(dateOfDeadline);
				dateOfDeadline.setHours(8, 0, 0, 0);

				// Creates new project
				const newProject = new Project({
					user: req.user._id,
					projectName,
					projectDescription,
					natureOfProject,
					dateOfDeadline,
					projectImage,
				});

				// Saves new project to database and then sends a success response
				await newProject
					.save()
					.then(
						resourceSuccessResponseWithCookie(res, 200, newProject, 'Project')
					);
			} catch (error) {
				throw new ErrorHandler(400);
			}
		})
	)
	// Deletes the project on a middleware level and just sends a success response in the route.
	.delete(
		[deleteProject],
		asyncHandler(async (req, res) => {
			try {
				await deleteResourceSuccess(res);
			} catch (error) {
				throw new ErrorHandler(405);
			}
		})
	);

// Doublecheck frontend what this route is for
router.route('/current').get(
	asyncHandler(async (req, res) => {
		console.log(res.locals);
		res.send({ status: true });
	})
);

// Route for individual projects, this should always be last due to the route param.
router
	.route('/:projectId')
	.get(
		[resourceVerification('project')],
		asyncHandler(async (req, res) => {
			try {
				await resourceSuccessResponseWithCookie(
					res,
					200,
					req.project,
					'Project'
				);
			} catch (error) {
				throw new ErrorHandler(400);
			}
		})
	)
	.patch(
		[entryValidation('project'), projectEntryAuthorization],
		asyncHandler(async (req, res) => {
			let { projectName, projectDescription, natureOfProject, dateOfDeadline } =
				req.body;

			dateOfDeadline = new Date(dateOfDeadline);
			dateOfDeadline.setHours(8, 0, 0, 0);

			try {
				const projectUpdate = await Project.findByIdAndUpdate(
					req.params.projectId,
					{ projectName, projectDescription, natureOfProject, dateOfDeadline },
					{ new: true, runValidators: true }
				);

				return await resourceSuccessResponseWithCookie(
					res,
					200,
					projectUpdate,
					'Project'
				);
			} catch (error) {
				throw new ErrorHandler(406);
			}
		})
	)
	.delete(
		[resourceVerification('project'), deleteProject],
		asyncHandler(async (req, res) => {
			try {
				await deleteResourceSuccess(res);
			} catch (error) {
				throw new ErrorHandler(405);
			}
		})
	);

module.exports = router;
