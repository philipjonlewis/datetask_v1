const express = require('express');
const router = express.Router();

const Card = require('../models/modelSchema/CardModelSchema');
const Task = require('../models/modelSchema/TaskModelSchema');
const moment = require('moment');
// const { returnToday } = require('../utilities/getDates');

const { asyncHandler } = require('../middleware/asyncHandler');
const ErrorHandler = require('../middleware/errorHandler');
const {
	getResourceSuccess,
	postResourceSuccess,
	patchResourceSuccess,
	deleteResourceSuccess,
} = require('../middleware/successHandler');

const cookieHandler = require('../middleware/cookieHandler');
const userAuthentication = require('../middleware/authentication/userAuthentication');

const {
	entryValidation,
} = require('../middleware/formValidations/entryValidation');

const {
	taskEntryAuthorization,
} = require('../middleware/authorization/taskEntryAuthorization');

const {
	resourceVerification,
} = require('../middleware/verification/resourceVerification');

const { deleteTask } = require('../middleware/cascadeDelete/deleteFunctions');

router.use(cookieHandler, userAuthentication);

router
	.route('/')
	.get(
		asyncHandler(async (req, res) => {
			const {
				dateOfDeadline,
				isCompleted,
				isPriority,
				isLapsed,
			} = await req.query;
			try {
				const tasks = await Task.find({
					user: await req.user._id,
					phase: await res.locals.currentPhase,
					...(dateOfDeadline && { dateOfDeadline }),
					...(isCompleted && { isCompleted }),
					...(isPriority && { isPriority }),
					...(isLapsed && { isLapsed }),
				});

				await getResourceSuccess(res, tasks);
			} catch (error) {
				throw new ErrorHandler(404);
			}
		})
	)
	.post(
		[entryValidation('task'), taskEntryAuthorization],
		asyncHandler(async (req, res) => {
			try {
				let {
					_id,
					dateOfDeadline,
					isCompleted,
					isPriority,
					content,
				} = await req.body;

				dateOfDeadline = new Date(dateOfDeadline);
				dateOfDeadline.setHours(8, 0, 0, 0);

				const newTask = new Task({
					_id: await _id,
					user: await req.user._id.toString(),
					phase: await res.locals.currentPhase.toString(),
					card: req.card._id.toString(),
					dateOfDeadline: await dateOfDeadline,
					isCompleted: await isCompleted,
					isPriority: await isPriority,
					content: await content,
				});

				await newTask.save();
				await req.card.tasks.push(newTask._id);
				await req.card.save();

				// await postResourceSuccess(res, newTask);
				await postResourceSuccess(res, null);
			} catch (error) {
				throw new ErrorHandler(400);
			}
		})
	)
	.delete(
		[deleteTask],
		asyncHandler(async (req, res) => {
			try {
				await deleteResourceSuccess(res);
			} catch (error) {
				throw new ErrorHandler(405);
			}
		})
	);

// This is kinda an override route.
// You use this route to move lapsed tasks into a date into the future. and change lapsed to false so you can edit it again in the edit route.
// this is intentionally a hassle because this is a free feature.
// Maybe a paid feature is editing lapsed tasks
router.route('/movelapsedtask').patch(
	[entryValidation('movelapsedtask')],
	asyncHandler(async (req, res) => {
		let { dateOfDeadline, taskId } = req.body;

		dateOfDeadline = new Date(dateOfDeadline);
		dateOfDeadline.setHours(8, 0, 0, 0);

		const task = await Task.find({ _id: taskId, isLapsed: true }).limit(1);

		if (!task[0]) {
			throw new ErrorHandler(404);
		}

		const updatedTask = await Task.findByIdAndUpdate(
			taskId,
			{
				dateOfDeadline,
				isLapsed: false,
				isCompleted: false,
				isPriority: false,
			},
			{ new: true, runValidators: true }
		);

		await req.card.tasks.push(updatedTask._id);
		await req.card.save();

		await patchResourceSuccess(res, updatedTask);
	})
);

router
	.route('/:taskId')
	.get(
		[resourceVerification('task')],
		asyncHandler(async (req, res) => {
			try {
				await getResourceSuccess(res, req.task);
			} catch (error) {
				throw new ErrorHandler(400);
			}
		})
	)
	.patch(
		[entryValidation('task'), taskEntryAuthorization],
		asyncHandler(async (req, res) => {
			try {
				let { dateOfDeadline, content, isCompleted, isPriority } = req.body;

				dateOfDeadline = new Date(dateOfDeadline);
				dateOfDeadline.setHours(8, 0, 0, 0);

				// Removes task reference from previous card
				await Card.updateOne(
					{ tasks: { $in: [req.params.taskId] } },
					{ $pull: { tasks: req.params.taskId } }
				);

				// req.card is the new card so this will now be the new card
				const updatedTask = await Task.findByIdAndUpdate(
					req.params.taskId,
					{
						card: req.card._id,
						...(dateOfDeadline && { dateOfDeadline }),
						...(isCompleted && { isCompleted }),
						...(isPriority && { isPriority }),
						...(content && { content }),
					},
					{ new: true, runValidators: true }
				);

				// pushing the task id to the cards tasks reference
				req.card.tasks.push(updatedTask._id);
				// Saving the card with the new referenve
				req.card.save();
				// success
				await patchResourceSuccess(res, updatedTask);
			} catch (error) {
				throw new ErrorHandler(406);
			}
		})
	)
	.delete(
		[resourceVerification('task'), deleteTask],
		asyncHandler(async (req, res) => {
			try {
				await deleteResourceSuccess(res);
			} catch (error) {
				throw new ErrorHandler(405);
			}
		})
	);

router.route('/isPriority/:taskId').patch(
	[entryValidation('editTaskPriority')],
	asyncHandler(async (req, res) => {
		try {
			const { isPriority } = req.body;

			const updatedTask = await Task.findByIdAndUpdate(
				req.params.taskId,
				{
					isPriority,
				},
				{ new: false, runValidators: false }
			);

			await patchResourceSuccess(res);
		} catch (error) {
			throw new ErrorHandler(406);
		}
	})
);

router.route('/isCompleted/:taskId').patch(
	[entryValidation('editTaskCompletion')],
	asyncHandler(async (req, res) => {
		try {
			const { isCompleted } = req.body;

			const updatedTask = await Task.findByIdAndUpdate(
				req.params.taskId,
				{
					isCompleted,
				},
				{ new: false, runValidators: false }
			);

			await patchResourceSuccess(res);
		} catch (error) {
			throw new ErrorHandler(406);
		}
	})
);

router.route('/content/:taskId').patch(
	[entryValidation('editTaskContent')],
	asyncHandler(async (req, res) => {
		try {
			const { content } = req.body;

			const updatedTask = await Task.findByIdAndUpdate(
				req.params.taskId,
				{
					content,
				},
				{ new: false, runValidators: false }
			);

			await patchResourceSuccess(res);
		} catch (error) {
			throw new ErrorHandler(406);
		}
	})
);

module.exports = router;
