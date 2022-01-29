const Task = require('../models/modelSchema/TaskModelSchema');
const Card = require('../models/modelSchema/CardModelSchema');

const { asyncHandler } = require('./asyncHandler');

exports.lapsedTaskRunner = asyncHandler(async (req) => {
	let dateToday = new Date();
	dateToday.setHours(0, 0, 0, 0);

	await Task.updateMany(
		{
			user: req.user._id,
			dateOfDeadline: { $lt: dateToday },
			isCompleted: false,
		},
		{
			isLapsed: true,
		}
	);
	await Task.updateMany(
		{
			user: req.user._id,
			dateOfDeadline: { $gte: dateToday },
			isCompleted: true,
		},
		{
			isLapsed: false,
		}
	);
});
