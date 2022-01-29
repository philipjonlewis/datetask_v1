const User = require('../../models/modelSchema/UserModelSchema');
const Project = require('../../models/modelSchema/ProjectModelSchema');
const Phase = require('../../models/modelSchema/PhaseModelSchema');
const Card = require('../../models/modelSchema/CardModelSchema');
const Task = require('../../models/modelSchema/TaskModelSchema');


const ErrorHandler = require('../errorHandler');
const { asyncHandler } = require('../asyncHandler');

const {
	deleteTaskAndCardReference,
	deletePhaseAndReferences,
	deleteProjectAndReference,
} = require('./cascadeHelpers');

const deleteTask = asyncHandler(async (req, res, next) => {
	try {
		let { dateOfDeadline } = await req.body;
		// dateOfDeadline = moment(dateOfDeadline).startOf('day');
		let currentCard = await Card.find({
			user: req.user._id.toString(),
			phase: res.locals.currentPhase.toString(),
			...((await dateOfDeadline) && {
				dateOfDeadline,
			}),
			...(req.params.taskId && {
				tasks: req.params.taskId.toString(),
			}),
		}).limit(1);
		currentCard = currentCard[0];

		const singleTask = await Task.exists({
			user: await req.user._id.toString(),
			_id: req.params.taskId,
		});

		const taskArray = singleTask
			? await Task.find({
					user: await req.user._id.toString(),
					_id: await req.params.taskId,
			  }).limit(1)
			: await Task.find({
					user: await req.user._id.toString(),
					_id: { $in: await currentCard.tasks },
			  });

		await Task.deleteMany({
			user: await req.user._id.toString(),
			_id: { $in: taskArray },
		});

		await Card.findByIdAndUpdate(
			{
				_id: await currentCard._id.toString(),
			},
			{ $pull: { tasks: { $in: taskArray } } }
		);

		next();
	} catch (error) {
		throw new ErrorHandler(400, error.message);
	}
});

// Deletes card and all tasks in it.
const deleteCard = asyncHandler(async (req, res, next) => {
	try {
		const currentPhase = await Phase.find({
			user: await req.user._id.toString(),
			_id: await res.locals.currentPhase.toString(),
		}).limit(1);

		const singleCard = await Card.exists({
			user: await req.user._id.toString(),
			_id: await req.params.cardId,
		});

		let cardArray = singleCard
			? await Card.find({
					user: await req.user._id.toString(),
					_id: await req.params.cardId,
			  }).limit(1)
			: await Card.find({
					user: await req.user._id.toString(),
					_id: { $in: await currentPhase[0].cards },
			  });

		// This function is for deleting empty cards
		const emptyCards = await Card.find({
			user: req.user._id,
			phase: res.locals.currentPhase,
			tasks: { $exists: true, $size: 0 },
		});

		if (emptyCards.length !== 0) {
			const emptyCardArray = emptyCards.map((card) => card._id.toString());
			await deleteTaskAndCardReference(emptyCardArray);
		}

		cardArray = cardArray.map((card) => card._id.toString());
		await deleteTaskAndCardReference(cardArray);
		next();
	} catch (error) {
		throw new ErrorHandler(400, error.message);
	}
});

// deletes phase and all cards and tasks
const deletePhase = asyncHandler(async (req, res, next) => {
	try {
		let currentProject = await Project.find({
			user: await req.user._id.toString(),
			_id: await res.locals.currentProject.toString(),
		}).limit(1);

		currentProject = currentProject[0];

		const singlePhase = await Phase.exists({
			user: await req.user._id.toString(),
			_id: await req.params.phaseId,
		});

		const phaseArray = singlePhase
			? await Phase.find({
					user: await req.user._id.toString(),
					_id: await req.params.phaseId,
			  }).limit(1)
			: await Phase.find({
					user: await req.user._id.toString(),
					_id: { $in: await currentProject.phases },
			  });
		await deletePhaseAndReferences(phaseArray, currentProject);
		next();
	} catch (error) {
		throw new ErrorHandler(400, error.message);
	}
});

// delete project and everything
const deleteProject = asyncHandler(async (req, res, next) => {
	try {
		let currentUser = await User.find({
			_id: await req.user._id.toString(),
		}).limit(1);

		currentUser = currentUser[0];

		const singleProject = await Project.exists({
			user: await req.user._id.toString(),
			_id: await req.params.projectId,
		});

		const projectArray = singleProject
			? await Project.find({
					user: await req.user._id.toString(),
					_id: await req.params.projectId,
			  }).limit(1)
			: await Project.find({
					user: await req.user._id.toString(),
					_id: { $in: await currentUser.projects },
			  });

		if (projectArray.length !== 0) {
			await deleteProjectAndReference(currentUser, projectArray);
		}
		next();
	} catch (error) {
		throw new ErrorHandler(400, error.message);
	}
});

const deleteEmptyCards = asyncHandler(async (req, res, next) => {
	try {
		let cardArray = await Card.find({
			user: await req.user._id.toString(),
			phase: res.locals.currentPhase,
			tasks: { $exists: true, $size: 0 },
		});

		cardArray = cardArray.map((card) => card._id.toString());

		await deleteTaskAndCardReference(cardArray);
		next();
	} catch (error) {
		throw new ErrorHandler(400, error.message);
	}
});

module.exports = {
	deleteTask,
	deleteCard,
	deletePhase,
	deleteProject,
	deleteEmptyCards,
};
