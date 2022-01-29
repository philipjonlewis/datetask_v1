const jwt = require('jsonwebtoken');
const { asyncHandler } = require('./asyncHandler');
const ErrorHandler = require('./errorHandler');

// Cookie Handler gets all the exising cookies and puts them into res.locals

const cookieHandler = asyncHandler(async (req, res, next) => {
	const userCookie = await req.signedCookies['datask-currentUser'];
	const projectCookie = await req.signedCookies['datask-currentProject'];
	const phaseCookie = await req.signedCookies['datask-currentPhase'];

	// if user is not logged in.
	if ( !userCookie ) {
		// this conditional is needed for the login as it checks previous logins.
		if (req.path === '/login') {
			return next();
		}
		// if there is no cookie and the route isnt login, then throw auth error.
		throw new ErrorHandler(401);
	}

	// is user cookie exist, JWT verify user cookie.
	const cookieAuthStatus = jwt.verify(userCookie, process.env.CONFIDENTIAL_ID);

	// if user isnt verified, throw error.
	// user is logged in but user data isn't verified
	if (!cookieAuthStatus) {
		throw new ErrorHandler(401);
	}

	// These are all ID Values
	res.locals.currentUser = await cookieAuthStatus._id;
	res.locals.currentProject = await projectCookie;
	res.locals.currentPhase = await phaseCookie;
	next();
});

module.exports = cookieHandler;
