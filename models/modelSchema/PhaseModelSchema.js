const mongoose = require('mongoose');
const { Schema } = mongoose;
const Project = require('./ProjectModelSchema');

const phaseSchema = new Schema(
	{
		_id: { type: String, required: true },
		user: { type: Schema.Types.ObjectId, ref: 'user' },
		project: { type: Schema.Types.ObjectId, ref: 'project' },
		phaseName: { type: String, require: true },
		phaseOrder: {
			type: Number,
			min: [1, 'Phase must start with the first phase'],
			max: [8, 'Phase must start with the first phase'],
			required: true,
		},
		cards: [{ type: String, ref: 'card' }],
	},
	{ timestamps: true }
);

phaseSchema.pre('save', async function (next) {
	const project = await Project.findById(this.project);

	if (!project.phases.includes(this._id)) {
		await Project.findByIdAndUpdate(this.project, {
			phases: [...project.phases, this._id],
		});
		next();
	} else {
		next();
	}
});

const Phase = mongoose.model('phase', phaseSchema);
module.exports = Phase;
