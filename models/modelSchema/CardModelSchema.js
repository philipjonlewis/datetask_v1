const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const Phase = require('./PhaseModelSchema');
const Task = require('./TaskModelSchema');

const moment = require('moment');

const cardSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'user' },
		phase: { type: String, ref: 'phase' },
		dateOfDeadline: { type: Date, required: true },
		tasks: [{ type: String, ref: 'task' }],
		isMilestone: { type: Boolean, default: false },
		_id: { type: String, required: true },
	},
	{ timestamps: true }
);

cardSchema.pre('save', async function (next) {
	const phase = await Phase.findById(this.phase);

	if (!phase.cards.includes(this._id)) {
		await Phase.findByIdAndUpdate(this.phase, {
			cards: [...phase.cards, this._id],
		});
		next();
	} else {
		next();
	}
});

cardSchema.post('findOneAndUpdate', async function (next) {
	const cardToUpdate = await this.model.findOne(this.getQuery());
	const newDate = await moment(cardToUpdate.dateOfDeadline).startOf('day');

	await Task.updateMany(
		{ _id: { $in: await cardToUpdate.tasks } },
		{ dateOfDeadline: newDate }
	);
});

const Card = mongoose.model('card', cardSchema);
module.exports = Card;
