const ErrorHandler = require('../errorHandler');
const Joi = require('joi');
const industry = require('../../utilities/industryList');
const { returnToday } = require('../../utilities/getDates');

const validationSchemas = {
	user: Joi.object({
		firstName: Joi.string().alphanum().required(),
		lastName: Joi.string().alphanum().required(),
		username: Joi.string().alphanum().trim().required(),
		password: Joi.string()
			.pattern(
				new RegExp(
					'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
				)
			)
			.trim()
			.required(),
		passwordConfirmation: Joi.string().valid(Joi.ref('password')).required(),
		newPassword: Joi.string()
			.pattern(
				new RegExp(
					'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
				)
			)
			.trim(),
		email: Joi.string().email().required(),
		birthday: Joi.date(),
		gender: Joi.string().alphanum(),
		industry: Joi.string()
			.alphanum()
			.valid(...industry.list),
		// .required(),
		businessType: Joi.string(),
		country: Joi.string(),
		stateRegion: Joi.string(),
		city: Joi.string(),
	}),
	project: Joi.object({
		projectName: Joi.string().required(),
		projectDescription: Joi.string().required(),
		natureOfProject: Joi.string().required(),
		projectImage: Joi.string(),
		dateOfDeadline: Joi.date().greater(returnToday().start).required(),
	}),
	phase: Joi.object({
		_id: Joi.string().guid({ version: 'uuidv4' }),
		phaseName: Joi.string().required(),
		phaseOrder: Joi.number().min(1).required(),
	}),
	card: Joi.object({
		dateOfDeadline: Joi.date().greater(returnToday().start).required(),
		isMilestone: Joi.boolean(),
		_id: Joi.string().guid({ version: 'uuidv4' }),
	}),
	task: Joi.object({
		dateOfDeadline: Joi.date().greater(returnToday().start).required(),
		content: Joi.string().required(),
		isCompleted: Joi.boolean(),
		isPriority: Joi.boolean(),
		_id: Joi.string().guid({ version: 'uuidv4' }),
	}),
	editTaskPriority: Joi.object({
		isPriority: Joi.boolean(),
		_id: Joi.string().guid({ version: 'uuidv4' }),
	}),
	editTaskCompletion: Joi.object({
		isCompleted: Joi.boolean(),
		_id: Joi.string().guid({ version: 'uuidv4' }),
	}),
	editTaskContent: Joi.object({
		content: Joi.string().required(),
		_id: Joi.string().guid({ version: 'uuidv4' }),
	}),
	movelapsedtask: Joi.object({
		dateOfDeadline: Joi.date().greater(returnToday().start).required(),
		taskId: Joi.string().required(),
	}),
};

exports.entryValidation = (route) => {
	return async function (req, res, next) {
		try {
			await validationSchemas[route].validateAsync(req.body, {
				escapeHtml: true,
				abortEarly: false,
			});
			return next();
		} catch (error) {
			const validationErrors = error.details.map((err) => {
				return err.path[0];
			});
			return next(new ErrorHandler(400, validationErrors));
		}
	};
};
