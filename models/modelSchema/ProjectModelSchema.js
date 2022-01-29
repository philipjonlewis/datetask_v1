const mongoose = require('mongoose');
const { Schema } = mongoose;
const chalk = require('chalk');
const User = require('./UserModelSchema');

const projectSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: [true, 'All projects must have a user'],
		},
		projectName: {
			type: String,
			required: [true, 'All projects must have a name'],
		},
		dateOfDeadline: { type: Date, required: true },
		projectDescription: { type: String },
		projectImage: { type: String },
		natureOfProject: {
			type: String,
			required: [true, 'All projects must have a category'],
		},
		phases: [{ type: String, ref: 'phase' }],
	},
	{ timestamps: true }
);

projectSchema.pre('save', async function (next) {
	const user = await User.findById(this.user);

	if (!user.projects.includes(this._id)) {
		await User.findByIdAndUpdate(this.user, {
			projects: [...user.projects, this._id],
		});
		next();
	} else {
		next();
	}

	next();
});

const Project = mongoose.model('project', projectSchema);
module.exports = Project;
