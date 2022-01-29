const ErrorHandler = require('../errorHandler');
const ObjectId = require('mongoose').Types.ObjectId;

const Project = require('../../models/modelSchema/ProjectModelSchema');
const Phase = require('../../models/modelSchema/PhaseModelSchema');
const Card = require('../../models/modelSchema/CardModelSchema');
const Task = require('../../models/modelSchema/TaskModelSchema');

async function capitalizeFirstLetter(string) {
	return (await string.charAt(0).toUpperCase()) + (await string.slice(1));
}

exports.resourceVerification = (resource) => {
	return async function (req, res, next) {
		try {
			const paramValue = await Object.values(req.params)[0];
			const modelName = await capitalizeFirstLetter(resource);

			const dbModel = {
				Project,
				Phase,
				Card,
				Task,
			};

			const dbResource = await dbModel[modelName]
				.find({
					user: await req.user._id,
					_id: await paramValue,
				})
				.select('-createdAt -updatedAt -__v')
				.limit(1);

			if (!dbResource[0]) {
				throw new ErrorHandler(404);
			}

			req[resource] = dbResource[0];

			next();
		} catch (error) {
			next(new ErrorHandler(404));
		}
	};
};
