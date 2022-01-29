exports.dateFormatter = (dateOfDeadline) => {
	const revisedDate = new Date(dateOfDeadline);
	const betterDate = revisedDate.toDateString();
	const dayOfWeek = betterDate.split(' ')[0];

	const displayDate = betterDate
		.split(' ')
		.slice(1, 3)
		.toString()
		.replace(',', ' ');

	const otherDate = betterDate
		.split(' ')
		.slice(1, 4)
		.toString()
		.replace(',', ' ');

	return {
		dayOfWeek,
		displayDate,
		otherDate,
	};
};

exports.daysDifference = (dateOfDeadline, dateOfCreation) => {
	let today = new Date();
	today.setHours(8, 0, 0, 0);

	let deadline = new Date(dateOfDeadline);
	deadline.setHours(8, 0, 0, 0);

	const deadlineDiffMs = Math.abs(deadline - today);
	const deadlineDiffDays = Math.ceil(deadlineDiffMs / (1000 * 60 * 60 * 24));

	let creation = new Date(dateOfCreation);
	creation.setHours(8, 0, 0, 0);

	const creationDiffMs = Math.abs(creation - today);
	const creationDiffDays = Math.ceil(creationDiffMs / (1000 * 60 * 60 * 24));

	return {
		deadlineDiffDays,
		creationDiffDays,
	};
};
