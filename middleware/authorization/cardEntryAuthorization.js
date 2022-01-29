const { asyncHandler } = require('../asyncHandler');
const ErrorHandler = require('../errorHandler');
const moment = require('moment');
const Card = require('../../models/modelSchema/CardModelSchema');

exports.cardEntryAuthorization = asyncHandler(async (req, res, next) => {
	let { dateOfDeadline, _id } = await req.body;

	dateOfDeadline = new Date(dateOfDeadline);
	dateOfDeadline.setHours( 8, 0, 0, 0 );
	
	const card = await Card.find({
		user: await req.user._id,
		phase: await res.locals.currentPhase,
		dateOfDeadline: await dateOfDeadline,
		_id: await _id,
	}).limit(1);

	if (card[0]) {
		throw new ErrorHandler(400);
	}

	await next();
});
