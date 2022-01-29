const express = require('express');
const router = express.Router();

const Project = require('../models/modelSchema/ProjectModelSchema');
const Phase = require('../models/modelSchema/PhaseModelSchema');
const Card = require('../models/modelSchema/CardModelSchema');
const Task = require('../models/modelSchema/TaskModelSchema');

const { asyncHandler } = require('../middleware/asyncHandler');
const ErrorHandler = require('../middleware/errorHandler');

const cookieHandler = require('../middleware/cookieHandler');
const userAuthentication = require('../middleware/authentication/userAuthentication');

// Checks if cookies exist and if user is authorized
router.use(cookieHandler, userAuthentication);

// Complex route for the infoboard/data aspect -MOVE TO DATA ROUTE
router.route('/projectdata').get(
	asyncHandler(async (req, res) => {
		const isProjectExisting = await Project.findById(res.locals.currentProject);

		if (!isProjectExisting) {
			throw new ErrorHandler('Resource Not Found', 204);
		}

		try {
			const project = await Project.findById(res.locals.currentProject);

			const phases = await Phase.find({ project: project._id })
				.sort({
					phaseOrder: 1,
				})
				.select('-user -project -updatedAt -__v');

			const cards = await Card.find({
				phase: phases.map((phase) => phase._id),
			})
				.sort({
					dateOfDeadline: 1,
				})
				.select('-user -_id -phase -createdAt -updatedAt -__v');

			const tasks = await Task.find({
				_id: [].concat.apply(
					[],
					cards.map((card) => card.tasks)
				),
			})
				.sort({
					dateOfDeadline: 1,
				})
				.select('-user -_id -phase -card -createdAt -updatedAt -__v -content');

			const projectData = {
				...(project.projectName && { projectName: await project.projectName }),
				...(project.projectDescription && {
					projectDescription: await project.projectDescription,
				}),
				...(project.natureOfProject && {
					natureOfProject: await project.natureOfProject,
				}),
				...(project.createdAt && { projectCreatedAt: await project.createdAt }),
				...(project.dateOfDeadline && {
					projectDateOfDeadline: await project.dateOfDeadline,
				}),
			};

			const phaseData = {
				phaseCount: phases.length,
				// phaseCompilation: phaseDataContents,
			};

			const cardData = {
				cardCount: cards.length,
				...(cards.length >= 1 && { firstCard: cards[0].dateOfDeadline }),
				...(cards.length >= 2 && {
					lastCard: cards[cards.length - 1].dateOfDeadline,
				}),
			};

			const taskData = {
				taskCount: tasks.length,
				activeTaskCount: tasks.filter(
					(task) => !task.isLapsed && !task.isCompleted
				).length,
				completedTaskCount: tasks.filter((task) => task.isCompleted).length,
				lapsedTaskCount: tasks.filter((task) => task.isLapsed).length,
				priorityTaskBreakdown: {
					priorityActive: tasks.filter(
						(task) => !task.isLapsed && !task.isCompleted && task.isPriority
					).length,
					priorityCompleted: tasks.filter(
						(task) => !task.isLapsed && task.isCompleted && task.isPriority
					).length,
					priorityLapsed: tasks.filter(
						(task) => task.isLapsed && !task.isCompleted && task.isPriority
					).length,
				},
				standardTaskBreakdown: {
					standardActive: tasks.filter(
						(task) => !task.isLapsed && !task.isCompleted && !task.isPriority
					).length,
					standardCompleted: tasks.filter(
						(task) => !task.isLapsed && task.isCompleted && !task.isPriority
					).length,
					standardLapsed: tasks.filter(
						(task) => task.isLapsed && !task.isCompleted && !task.isPriority
					).length,
				},
			};

			res.status(200).json({
				status: true,
				response: 'Showing aggregated project data',
				payloadCount: 1,
				payload: { projectData, phaseData, cardData, taskData },
			});
		} catch (error) {
			res.redirect('/projects');
			console.log('emelyn');
			console.log(error);
			// throw new ErrorHandler(error.message, 400);
		}
	})
);

module.exports = router;
