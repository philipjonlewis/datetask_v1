const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

require('dotenv').config();

// format parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.WALKERS_SHORTBREAD));

// Helmet Security
app.use(helmet());

// Cors Handler
app.use(
	cors({
		origin: 'http://localhost:3000',
		methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'PATCH', 'DELETE'],
		credentials: true,
	})
);

// Connects to the database
const dbConnect = require('./models/dbConnect');

// Routes
const userAuthRoute = require('./routes/userAuthRoute');
const projectsRoute = require('./routes/projectsRoute');
const phasesRoute = require('./routes/phasesRoute');
const cardsRoute = require('./routes/cardsRoute');
const tasksRoute = require('./routes/tasksRoute');
const dataRoute = require('./routes/dataRoute');

// Route End Points
app.use('/auth', userAuthRoute);
app.use('/projects', projectsRoute);
app.use('/phases', phasesRoute);
app.use('/cards', cardsRoute);
app.use('/tasks', tasksRoute);
app.use('/data', dataRoute);

// Page does not exist route
app.get('*', function (req, res) {
	res.status(404).send('404 | Page does not exist');
});

// Error Handler
app.use(async (error, req, res, next) => {
	let { message, status = 500 } = await error;

	switch (status) {
		case 400:
			message = message || 'Unable to create resource';
			break;
		case 401:
			message = message || 'Unauthorized Access';
			break;
		case 404:
			message = message || 'Unable to verify resource';
			break;
		case 406:
			message = message || 'Unable to edit resource';
			break;
		default:
			message = message || 'Something went wrong';
			break;
	}

	// Deletion error
	if (status === 405) {
		return res
			.status(status)
			.clearCookie(`datask-currentUser`, { path: '/' })
			.clearCookie(`datask-currentProject`, { path: '/' })
			.clearCookie(`datask-currentPhase`, { path: '/' })
			.header('Authorization', `Bearer `)
			.json({
				status: false,
				notice: 'Fatal error occured',
				message: 'Unable to delete. Please log in again.',
				...(message && { response: await message }),
			});
	}

	return (
		res
			.status(status)
			// .clearCookie(`datask-currentProject`, { path: '/' })
			// .clearCookie(`datask-currentPhase`, { path: '/' })
			.json({
				status: false,
				notice: 'Unexpected Error',
				...(message && { response: await message }),
			})
	);
});

// Port Listener
app.listen(process.env.PORT, async () => {
	await dbConnect();
	console.log(`App now listening on port ${process.env.PORT}`);
});
