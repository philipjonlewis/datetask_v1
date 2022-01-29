const User = require('../../models/modelSchema/UserModelSchema');
const Project = require('../../models/modelSchema/ProjectModelSchema');
const Phase = require('../../models/modelSchema/PhaseModelSchema');
const Card = require('../../models/modelSchema/CardModelSchema');
const Task = require('../../models/modelSchema/TaskModelSchema');

const deleteTaskAndCardReference = async (cardArray) => {
	let cardCount = 0;
	let arrayCount = 0;

	while (cardCount !== cardArray.length) {
		cardCount++;
		let currentCard = await Card.find({
			_id: cardArray[arrayCount],
		}).limit(1);

		currentCard = currentCard[0];

		await Task.deleteMany({ _id: { $in: await currentCard.tasks } });

		await Phase.findByIdAndUpdate(
			{
				_id: await currentCard.phase.toString(),
			},
			{ $pull: { cards: await currentCard._id.toString() } }
		);

		await Card.findByIdAndDelete(currentCard._id.toString());

		arrayCount++;
	}
};

const deletePhaseAndReferences = async (phaseArray, currentProject) => {
	let phaseCount = 0;
	let arrayCount = 0;
	while (phaseCount !== phaseArray.length) {
		phaseCount++;

		const currentPhaseId = await phaseArray[arrayCount];

		const currentPhaseDocument = await Phase.find({
			_id: currentPhaseId.toString(),
		}).limit(1);

		const cardArray = await currentPhaseDocument[0].cards;

		if (!cardArray) {
			continue;
		}

		if (cardArray.length !== 0) {
			await deleteTaskAndCardReference(cardArray);
		}

		await Project.findByIdAndUpdate(
			{
				_id: await currentProject._id.toString(),
			},
			{ $pull: { phases: await currentPhaseId.toString() } }
		);

		await Phase.findByIdAndDelete(currentPhaseId.toString());

		arrayCount++;
	}
};

const deleteProjectAndReference = async (currentUser, projectArray) => {
	let projectCount = 0;
	let arrayCount = 0;

	while (projectCount !== projectArray.length) {
		projectCount++;
		let currentProject = await Project.find({
			_id: await projectArray[arrayCount],
		}).limit(1);

		currentProject = currentProject[0];

		const phaseArray = await currentProject.phases;

		if (phaseArray.length !== 0) {
			await deletePhaseAndReferences(phaseArray, currentProject);
		}

		await User.findByIdAndUpdate(
			{
				_id: await currentUser._id.toString(),
			},
			{ $pull: { projects: await currentProject._id.toString() } }
		);
		await Project.findByIdAndDelete(currentProject._id.toString());
		arrayCount++;
	}
};

module.exports = {
	deleteTaskAndCardReference,
	deletePhaseAndReferences,
	deleteProjectAndReference,
};
