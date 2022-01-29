const { asyncHandler } = require('../asyncHandler');
const ErrorHandler = require('../errorHandler');

const Task = require('../../models/modelSchema/TaskModelSchema');
const Card = require('../../models/modelSchema/CardModelSchema');

const { v4: uuidv4 } = require('uuid');

const moment = require('moment');

exports.taskEntryAuthorization = asyncHandler(async (req, res, next) => {
	let { dateOfDeadline, content, _id } = await req.body;

	dateOfDeadline = new Date(dateOfDeadline);
	dateOfDeadline.setHours(8, 0, 0, 0);

	const { taskId } = req.params;

	const isCard = await Card.find({
		user: await req.user._id,
		phase: await res.locals.currentPhase,
		...(dateOfDeadline && { dateOfDeadline: await dateOfDeadline }),
		...(taskId && { tasks: await taskId }),
	}).limit(1);

	let card = isCard[0];

	if (!card) {
		try {
			card = new Card({
				_id: uuidv4(),
				user: await req.user._id,
				phase: await res.locals.currentPhase,
				dateOfDeadline: await dateOfDeadline,
			});
			await card.save();
		} catch (error) {
			console.log('this is in the taskEntryAuthorization file');
			console.log(error);
		}
	}

	const task = await Task.find({
		user: await req.user._id,
		phase: await res.locals.currentPhase,
		card: await card._id,
		dateOfDeadline: await dateOfDeadline,
		content: await content,
	}).limit(1);

	if (!taskId && task[0]) {
		throw new ErrorHandler(400);
	}
	req.card = card;

	return next();
});
