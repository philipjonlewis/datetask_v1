const express = require('express');
const router = express.Router();

const Phase = require('../models/modelSchema/PhaseModelSchema');
const Card = require('../models/modelSchema/CardModelSchema');
const moment = require('moment');

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
const { dateDifference, newDateOfDeadline } = require('../utilities/getDates');

const {
	entryValidation,
} = require('../middleware/formValidations/entryValidation');

const {
	cardEntryAuthorization,
} = require('../middleware/authorization/cardEntryAuthorization');

const {
	resourceVerification,
} = require('../middleware/verification/resourceVerification');

const {
	deleteCard,
	deleteEmptyCards,
} = require('../middleware/cascadeDelete/deleteFunctions');

router.use(cookieHandler, userAuthentication);

router
	.route('/')
	.get(
		[deleteEmptyCards],
		asyncHandler(async (req, res) => {
			await Card.deleteMany({
				user: req.user._id,
				phase: res.locals.currentPhase,
				tasks: { $exists: true, $size: 0 },
			});
			try {
				let dateToday = new Date();
				dateToday.setHours(8, 0, 0, 0);

				let cards = await Card.find({
					user: req.user._id,
					phase: res.locals.currentPhase,
					dateOfDeadline: { $gte: dateToday },
				})
					.select(
						'+_id +dateOfDeadline -createdAt -phase -updatedAt -user -__v'
					)
					.sort({ dateOfDeadline: 1 })
					.populate({
						path: 'tasks',
						ref: 'task',
						match: { isLapsed: false },
						select: '-createdAt -updatedAt -user -__v -phase -card',
					});

				newCards = cards.filter((card) => card.tasks.length !== 0);

				await getResourceSuccess(res, newCards);
			} catch (error) {
				throw new ErrorHandler(404);
			}
		})
	)
	.post(
		[entryValidation('card'), cardEntryAuthorization],
		asyncHandler(async (req, res) => {
			try {
				let { dateOfDeadline, _id, isMilestone } = req.body;

				dateOfDeadline = new Date(dateOfDeadline);
				dateOfDeadline.setHours(8, 0, 0, 0);

				const newCard = await new Card({
					user: req.user._id,
					phase: res.locals.currentPhase,
					isMilestone,
					dateOfDeadline,
					_id,
				});

				await newCard.save();
				await postResourceSuccess(res, newCard);
			} catch (error) {
				throw new ErrorHandler(400);
			}
		})
	)
	.delete(
		[deleteCard],
		asyncHandler(async (req, res) => {
			try {
				await Phase.updateOne({ _id: res.locals.currentPhase }, { cards: [] });
				await deleteResourceSuccess(res);
			} catch (error) {
				throw new ErrorHandler(405);
			}
		})
	);

router.route('/lapsed').get(
	asyncHandler(async (req, res) => {
		let today = new Date();
		today.setHours(0, 0, 0, 0);
		try {
			const lapsedIncomplete = await Card.find({
				user: req.user._id,
				phase: res.locals.currentPhase,
				dateOfDeadline: { $lt: today },
			})
				.select('+_id +dateOfDeadline -createdAt -phase -updatedAt -user -__v')
				.sort({ dateOfDeadline: 1 })
				.populate({
					path: 'tasks',
					ref: 'task',
					// match: { isLapsed: true },
					select: '-createdAt -updatedAt -user -__v -phase -card',
				});

			const lapsedTasks = lapsedIncomplete.filter(
				(card) => card.tasks.length !== 0
			);

			await getResourceSuccess(res, lapsedTasks);
		} catch (error) {
			throw new ErrorHandler(404);
		}
	})
);

// router.route('/lapsed/completed').get(
// 	asyncHandler(async (req, res) => {
// 		let today = new Date();
// 		today.setHours(0, 0, 0, 0);

// 		try {
// 			let lapsedCompleted = await Card.find({
// 				user: req.user._id,
// 				phase: res.locals.currentPhase,
// 				dateOfDeadline: { $lt: { today } },
// 			})
// 				.select('+_id +dateOfDeadline -createdAt -phase -updatedAt -user -__v')
// 				.sort({ dateOfDeadline: 1 })
// 				.populate({
// 					path: 'tasks',
// 					ref: 'task',
// 					match: { isLapsed: true, isCompleted: true },
// 					select: '-createdAt -updatedAt -user -__v -phase -card',
// 				});

// 			let completed = lapsedCompleted.filter((card) => card.tasks.length !== 0);

// 			console.log(completed);

// 			await getResourceSuccess(res, completed);
// 		} catch (error) {
// 			throw new ErrorHandler(404);
// 		}
// 	})
// );

// Paid feature to move the dates of all cards, including lapsed ones.
// Edit the first cards DOD and then compute the difference between old and new

// 	1 . get the new deadline of the first card from user
// 	2 . get the difference between the old deadline and the new deadline
// 	3 . get all cards under the phase and update all their deadlines
//  4 . Make an update middleware for thhe card to auto change the dod of the tasks as well

router
	.route('/moveallcards')
	.patch([entryValidation('card')], async (req, res, next) => {
		// Just add params if you only wanna move one Card

		let { dateOfDeadline: newDeadline } = await req.body;

		dateOfDeadline = new Date(dateOfDeadline);
		dateOfDeadline.setHours(8, 0, 0, 0);

		newDeadline = new Date(newDeadline);
		newDeadline.setHours(8, 0, 0, 0);

		const { cardId } = req.query;

		const cardArray = await Card.find({
			user: req.user._id,
			phase: res.locals.currentPhase,
			...(cardId && { _id: cardId.toString() }),
		});
		const existingDeadline = cardArray[0].dateOfDeadline;
		const dateDif = dateDifference(existingDeadline, newDeadline) + 1;

		let cardCount = 0;
		let arrayCount = 0;

		while (cardCount !== cardArray.length) {
			cardCount++;
			const currentCard = cardArray[arrayCount];
			const { dateOfDeadline } = currentCard;
			const revisedDeadline = newDateOfDeadline(dateOfDeadline, dateDif);
			await Card.findByIdAndUpdate(
				{ _id: await currentCard._id },
				{ dateOfDeadline: await revisedDeadline },
				{ new: true, runValidators: true }
			);
			// Card that updates all tasks in this is in the schema hooks
			arrayCount++;
		}

		await patchResourceSuccess(res);
	});

// End of feature

router
	.route('/:cardId')
	.get(
		[resourceVerification('card')],
		asyncHandler(async (req, res) => {
			try {
				await getResourceSuccess(res, req.card);
			} catch (error) {
				throw new ErrorHandler(404);
			}
		})
	)
	.patch(
		[entryValidation('card'), cardEntryAuthorization],
		asyncHandler(async (req, res) => {
			try {
				let { dateOfDeadline, isMilestone } = await req.body;

				dateOfDeadline = new Date(dateOfDeadline);
				dateOfDeadline.setHours(8, 0, 0, 0);

				const { cardId } = await req.params;

				const updatedCard = await Card.findByIdAndUpdate(
					cardId,
					...(dateOfDeadline && { dateOfDeadline }),
					...(isMilestone && { isMilestone }),
					{ new: true, runValidators: true }
				);
				// Code that edits the date of the tasks under this card is in its schema hooks
				await patchResourceSuccess(res, updatedCard);
			} catch (error) {
				throw new ErrorHandler(406);
			}
		})
	)
	.delete(
		[resourceVerification('card'), deleteCard],
		asyncHandler(async (req, res) => {
			try {
				await Phase.findByIdAndUpdate(res.locals.currentPhase, {
					$pull: { cards: await req.params.cardId.toString() },
				});
				await deleteResourceSuccess(res);
			} catch (error) {
				throw new ErrorHandler(405);
			}
		})
	);

module.exports = router;
