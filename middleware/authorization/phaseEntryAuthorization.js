const { asyncHandler } = require('../asyncHandler');
const ErrorHandler = require('../errorHandler');

const Phase = require('../../models/modelSchema/PhaseModelSchema');

exports.phaseEntryAuthorization = asyncHandler(async (req, res, next) => {
	const { phaseName, phaseOrder } = req.body;

	const phase = await Phase.exists({
		user: req.user._id,
		project: res.locals.currentProject,
		phaseName,
		phaseOrder,
	});

	if (phase) {
		throw new ErrorHandler(400);
	}

	return next();
});
