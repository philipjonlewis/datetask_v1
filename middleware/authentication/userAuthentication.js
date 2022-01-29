const jwt = require('jsonwebtoken');
const User = require('../../models/modelSchema/UserModelSchema');
const { asyncHandler } = require('../asyncHandler');
const ErrorHandler = require('../errorHandler');
const safeCompare = require( '../infosec/cryptoSafeCompare' );

// User authentication checks if logged in user is in the database.

// This middleware must be used after the cookie handler.

const userAuthentication = asyncHandler(async (req, res, next) => {
	// The code for user type (free, paid) will be verified here.

	// Finds user from db (user data from cookie handler)
	const userFromDb = await User.find({ _id: res.locals.currentUser })
		.limit(1)
		.select(
			'-authToken -email -password -createdAt -updatedAt -__v -membership -firstName -lastName'
		);

	// if user does not exist, throw error.
	if (!userFromDb[0]) {
		throw new ErrorHandler(401);
	}

	// if user exists, assign to req.user and move forward.
	req.user = userFromDb[0];
	next();
});

module.exports = userAuthentication;
