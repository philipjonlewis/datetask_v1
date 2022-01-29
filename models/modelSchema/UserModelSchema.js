const mongoose = require('mongoose');
const { Schema } = mongoose;
const industry = require('../../utilities/industryList');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userLocationSchema = new Schema({
	country: { type: String },
	stateRegion: { type: String },
	city: { type: String },
	geolocation: [{ type: String }],
});

const isVerifiedSchema = new Schema([
	{
		email: {
			type: Boolean,
			default: false,
		},
	},
]);

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: [true, 'You must enter your first name'],
		},
		lastName: {
			type: String,
			required: [true, 'You must enter your last name'],
		},
		username: {
			type: String,
			required: [true, 'You must enter a username'],
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: [true, 'You must enter a password'],
			trim: true,
			select: false,
		},
		email: {
			type: String,
			required: [true, 'You must enter an email'],
			trim: true,
			unique: true,
		},
		birthday: {
			type: Date,
			select: false,
		},
		gender: {
			type: String,
			select: false,
		},
		industry: {
			type: String,
			enum: industry.list,
			required: false,
			select: false,
		},
		businessType: {
			type: String,
			select: false,
		},
		location: {
			type: userLocationSchema,
			select: false,
		},
		authToken: {
			type: String,
			select: false,
		},
		role: {
			type: String,
			default: 'User',
		},
		membership: {
			type: String,
			default: 'Free',
		},
		isVerified: {
			type: isVerifiedSchema,
			select: false,
		},
		isActive: {
			type: Boolean,
			select: false,
		},
		projects: [
			{
				type: Schema.Types.ObjectId,
				ref: 'project',
			},
		],
	},
	{ timestamps: true }
);

userSchema.virtual('fullName').get(function () {
	return this.firstName + ' ' + this.lastName;
});

userSchema.pre('save', async function (next) {
	const token = jwt.sign({ _id: this._id }, process.env.CONFIDENTIAL_ID);
	this.authToken = token;
	const user = this;

	if (!user.isModified('password')) {
		return next();
	}

	this.password = await bcrypt.hash(this.password, 10);
	next();
});

const User = mongoose.model('user', userSchema);
module.exports = User;
