const moment = require('moment');

exports.returnToday = function () {
	var start = new Date();
	start.setHours(0, 0, 0, 0);

	var end = new Date();
	end.setHours(23, 59, 59, 999);

	return { start, end };
};

exports.returnTomorrow = function () {
	const tomorrow = new Date();
	tomorrow.setDate(new Date().getDate() + 1);
	const year = tomorrow.getFullYear();
	const month = tomorrow.getMonth();
	const day = tomorrow.getDate();

	return `${year}-${month}-${day}`;
};

exports.returnYesterday = function () {
	const yesterday = new Date();
	yesterday.setDate(new Date().getDate() - 1);
	const year = yesterday.getFullYear();
	const month = yesterday.getMonth();
	const day = yesterday.getDate();

	return `${year}-${month}-${day}`;
};

exports.dateFormat = function (param) {
	const givenDate = new Date(param);
	const year = givenDate.getFullYear();
	const month = givenDate.getMonth();
	const day = givenDate.getDate();

	return `${year}-${month}-${day}`;
};

exports.dateDifference = (existingDeadline, newDeadline) => {
	const existingDate = moment(existingDeadline).startOf('day');
	const newDate = moment(newDeadline).startOf('day');

	return newDate.diff(existingDate, 'days');
};

exports.newDateOfDeadline = (existingDate, dateDifference) => {
	return new Date(
		moment(existingDate).startOf('day').add(dateDifference, 'days')
	);
};

