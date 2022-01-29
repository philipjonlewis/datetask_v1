const express = require('express');
const router = express.Router();

const Project = require('../models/modelSchema/ProjectModelSchema');
const Phase = require('../models/modelSchema/PhaseModelSchema');

const { asyncHandler } = require('../middleware/asyncHandler');
const ErrorHandler = require('../middleware/errorHandler');
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
	phaseEntryAuthorization,
} = require('../middleware/authorization/phaseEntryAuthorization');

const {
	resourceVerification,
} = require('../middleware/verification/resourceVerification');

const { deletePhase } = require('../middleware/cascadeDelete/deleteFunctions');
const { Mongoose } = require('mongoose');

router.use(cookieHandler, userAuthentication);

router
	.route('/')
	.get(
		asyncHandler(async (req, res) => {
			try {
				const currentProject = await Project.find({
					user: await req.user._id.toString(),
					_id: res.locals.currentProject,
				})
					.limit(1)
					.select(
						' -projectName -projectDescription -natureOfProject -createdAt -updatedAt -__v'
					);

				const allPhases = await Phase.find({
					_id: { $in: await currentProject[0].phases },
					user: req.user._id.toString(),
				})
					.sort({ phaseOrder: 1 })
					.select('-createdAt -updatedAt -__v +project');
				
				await getResourceSuccess(res, allPhases);
			} catch (error) {
				throw new ErrorHandler(404);
			}
		})
	)
	.post(
		[entryValidation('phase'), phaseEntryAuthorization],
		asyncHandler(async (req, res) => {
			try {
				const { phaseName, phaseOrder, _id } = req.body;

				const newPhase = new Phase({
					_id,
					user: req.user._id,
					project: res.locals.currentProject,
					phaseName,
					phaseOrder,
				});

				await newPhase.save();
				await resourceSuccessResponseWithCookie(res, 200, newPhase, 'Phase');
			} catch (error) {
				throw new ErrorHandler(400);
			}
		})
	)
	.delete(
		[deletePhase],
		asyncHandler(async (req, res) => {
			try {
				await deleteResourceSuccess(res);
			} catch (error) {
				throw new ErrorHandler(405);
			}
		})
	);

router
	.route('/:phaseId')
	.get(
		[resourceVerification('phase')],
		asyncHandler(async (req, res) => {
			try {
				await resourceSuccessResponseWithCookie(res, 201, req.phase, 'Phase');
			} catch (error) {
				throw new ErrorHandler(400);
			}
		})
	)
	.patch(
		[entryValidation('phase'), phaseEntryAuthorization],
		asyncHandler(async (req, res) => {
			const { phaseName, phaseOrder } = req.body;
			try {
				const phaseUpdate = await Phase.findByIdAndUpdate(
					req.params.phaseId,
					{ phaseName, phaseOrder },
					{ new: true, runValidators: true }
				);

				await resourceSuccessResponseWithCookie(res, 200, phaseUpdate, 'Phase');
			} catch (error) {
				throw new ErrorHandler(406);
			}
		})
	)
	.delete(
		[resourceVerification('phase'), deletePhase],
		asyncHandler(async (req, res) => {
			try {
				deleteResourceSuccess(res);
			} catch (error) {
				throw new ErrorHandler(405);
			}
		})
	);

module.exports = router;
