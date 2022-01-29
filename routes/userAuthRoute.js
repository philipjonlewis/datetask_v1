const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');

const ErrorHandler = require('../middleware/errorHandler');
const { asyncHandler } = require('../middleware/asyncHandler');
const cookieHandler = require('../middleware/cookieHandler');
const userAuthentication = require('../middleware/authentication/userAuthentication');

const {
	entryValidation,
} = require('../middleware/formValidations/entryValidation');

const User = require('../models/modelSchema/UserModelSchema');
const Project = require('../models/modelSchema/ProjectModelSchema');
const Phase = require('../models/modelSchema/PhaseModelSchema');
const Card = require('../models/modelSchema/CardModelSchema');
const Task = require('../models/modelSchema/TaskModelSchema');

// Make routes for the ff:
// DELETE - Delete user and all projects in it. but just integrate the delete all projects. or turn it into a middleware?

router.route('/signup').post(
	// [entryValidation('user')],
	asyncHandler(async (req, res) => {
		let { username, email } = req.body;

		username = username.toLowerCase();
		email = email.toLowerCase();

		const isUsernameTaken = await User.findOne({ username });
		const isEmailTaken = await User.findOne({ email });

		if (isUsernameTaken || isEmailTaken) {
			throw new ErrorHandler(400);
		}

		let { country, stateRegion, city } = await req.body;

		let location = {
			country,
			stateRegion,
			city,
		};

		req.body.location = location;

		const newUser = new User(req.body);
		await newUser.save();
		return await res
			.status(201)
			.clearCookie(`datask-currentProject`, { path: '/' })
			.clearCookie(`datask-currentPhase`, { path: '/' })
			.header('Authorization', `Bearer ${newUser.authToken}`)
			.cookie('datask-currentUser', newUser.authToken, {
				signed: true,
				expires: new Date(Date.now() + 604800000),
				secure: false,
			})
			.json({
				status: true,
				response: 'Successfully created a new user',
				payload: newUser.authToken,
			});
	})
);

// router.route('/signup').post((req, res) => {
// 	res.send('this works');
// });

router.route('/login').post(
	[cookieHandler],
	asyncHandler(async (req, res) => {
		let { username, password } = req.body;

		// Checks if you are recently signed up or is currently logged in.
		if (res.locals.currentUser) {
			const databaseUser = await User.find({
				_id: res.locals.currentUser,
			})
				.limit(1)
				.select('authToken');

			if (!databaseUser[0]) {
				throw new ErrorHandler(401);
			}

			const { authToken } = databaseUser[0];

			return await res
				.status(200)
				.clearCookie(`datask-currentProject`, { path: '/' })
				.clearCookie(`datask-currentPhase`, { path: '/' })
				.header('Authorization', `Bearer ${authToken}`)
				.cookie('datask-currentUser', authToken, {
					signed: true,
					expires: new Date(Date.now() + 604800000),
					secure: false,
				})
				.send({
					status: true,
					response: 'Successfully Logged in',
					authToken: authToken,
				});
		}

		const currentUser = await User.find({ username })
			.limit(1)
			.select('password authToken');

		if (!currentUser[0]) {
			throw new ErrorHandler(401);
		}

		const match = await bcrypt.compare(password, currentUser[0].password);

		if (!match) {
			clearTrace(res);
			throw new ErrorHandler(401);
		}

		const { authToken } = currentUser[0];

		return await res
			.status(200)
			.clearCookie(`datask-currentProject`, { path: '/' })
			.clearCookie(`datask-currentPhase`, { path: '/' })
			.header('Authorization', `Bearer ${authToken}`)
			.cookie('datask-currentUser', authToken, {
				signed: true,
				expires: new Date(Date.now() + 604800000),
				secure: false,
			})
			.send({
				status: true,
				response: 'Successfully Logged in',
				authToken: authToken,
			});
	})
);

router.route('/update').patch(
	[cookieHandler, userAuthentication, entryValidation('user')],
	asyncHandler(async (req, res) => {
		const currentUser = await User.find({ _id: req.user._id })
			.limit(1)
			.select('password');

		if (!currentUser[0]) {
			throw new ErrorHandler(404);
		}

		const match = await bcrypt.compare(
			req.body.password,
			currentUser[0].password
		);

		if (!match) {
			clearTrace(res);
			throw new ErrorHandler(401);
		}

		let updatedData = Object.fromEntries(
			Object.entries(req.body).filter(([key, value]) => value != null)
		);

		delete updatedData.password;
		delete updatedData.passwordConfirmation;

		if (updatedData.newPassword) {
			updatedData.password = await bcrypt.hash(updatedData.newPassword, 10);
		}

		let updatedUser = await User.findByIdAndUpdate(
			req.user._id.toString(),
			updatedData,
			{ new: true, omitUndefined: true }
		);

		// Sending a success response
		return await res
			.status(202)
			.clearCookie(`datask-currentProject`, { path: '/' })
			.clearCookie(`datask-currentPhase`, { path: '/' })
			.json({
				status: true,
				response: 'Successfully edited your info',
				payload: updatedUser,
			});
	})
);

router.route('/signout').get(
	asyncHandler(async (req, res) => {
		return await res
			.status(200)
			.clearCookie(`datask-currentUser`, { path: '/' })
			.clearCookie(`datask-currentProject`, { path: '/' })
			.clearCookie(`datask-currentPhase`, { path: '/' })
			.header('Authorization', `Bearer `)
			.json({
				status: true,
				response: 'Successfully logged out',
			});
	})
);

router.route('/deleteuser').delete(
	[cookieHandler, userAuthentication],
	asyncHandler(async (req, res) => {
		const user = await User.find({ _id: req.user._id })
			.limit(1)
			.select('password');

		const match = await bcrypt.compare(req.body.password, user[0].password);

		if (req.body.password !== req.body.passwordConfirmation || !match) {
			throw new ErrorHandler(405);
		}

		if (match) {
			await Task.deleteMany({ user: req.user._id }, async () => {
				await Card.deleteMany({ user: req.user._id }, async () => {
					await Phase.deleteMany({ user: req.user._id }, async () => {
						await Project.deleteMany({ user: req.user._id }, async () => {
							await User.findByIdAndDelete(req.user._id, async () => {
								res
									.status(200)
									.clearCookie(`datask-currentUser`, { path: '/' })
									.clearCookie(`datask-currentProject`, { path: '/' })
									.clearCookie(`datask-currentPhase`, { path: '/' })
									.header('Authorization', `Bearer `)
									.json({
										success: true,
										response: 'Deleted User and all projects',
									});
							});
						});
					});
				});
			});
		}
	})
);

router.route('/verifyuser').get(
	[cookieHandler, userAuthentication],
	asyncHandler(async (req, res) => {
		const verifiedUser = await User.find({ _id: req.user._id })
			.limit(1)
			.select('firstName lastName username authToken membership projects');
		await res
			.status(200)
			.header('Authorization', `Bearer ${verifiedUser[0].authToken}`)
			.cookie('datask-currentUser', verifiedUser[0].authToken, {
				signed: true,
				expires: new Date(Date.now() + 604800000),
				secure: false,
			})
			.json({
				status: true,
				response: 'User Verified',
				payloadCount: 1,
				payload: verifiedUser[0],
			});
	})
);

module.exports = router;
