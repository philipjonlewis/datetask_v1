import React, { useState, useEffect, useRef, useContext } from 'react';

import LoadingWalkingMan from '../../loaders/LoadingWalkingMan';
import ErrorResponse from '../../stateresponses/ErrorResponse';

import AddPhaseForm from '../addresourceforms/addphaseform/AddPhaseForm';

import {
	daysDifference,
	dateFormatter,
} from '../../../middleware/dateFormatter';

// import { getPhases } from '../../../middleware/phaseRouteRequests';

import { getProjectData } from '../../../middleware/projectRouteRequests';

import { ProjectContext } from '../../../contexts/ProjectContext';

const InfoPanel = ({ phaseList, phaseListHandler }) => {
	const _isMounted = useRef(true);

	const [isLoading, isLoadingHandler] = useState(true);
	const [isError, isErrorHandler] = useState(false);

	const [isFormOpen, isFormOpenHandler] = useState(false);

	const [projectData, projectDataHandler] = useState({});
	const [phaseData, phaseDataHandler] = useState({});

	const [taskData, taskDataHandler] = useState({});

	const { setProjectDetails } = useContext(ProjectContext);

	useEffect(() => {
		if (_isMounted) {

			isLoadingHandler(false);

		}
	}, []);

	useEffect(() => {
		if (_isMounted) {
			console.log('running');
		}
	}, [projectData]);

	useEffect(() => {
		return () => {
			_isMounted.current = false;
		};
	}, []);

	if (!isLoading) {
		return (
			<div className="infopanel-container">
				<div
					className={
						isFormOpen
							? 'add-phase-slider-btn-container transform-45'
							: 'add-phase-slider-btn-container'
					}
					onClick={(e) => isFormOpenHandler((e) => !e)}
				>
					<span
						className="iconify"
						data-icon="gg:add"
						data-inline="false"
					></span>
				</div>

				<AddPhaseForm
					isFormOpen={isFormOpen}
					phaseList={phaseList}
					phaseListHandler={phaseListHandler}
				/>
				<div
					className="project-data-container"
					onMouseEnter={() => isFormOpenHandler(false)}
				>
					{/* <div className="project-infopanel-container">
						<div className="project-details">
							<div className="project-name">
								<p>{projectData.projectName}</p>
							</div>
							<div className="project-description">
								<p>{projectData.projectDescription}</p>
							</div>
							<div className="project-nature">
								<p>{projectData.natureOfProject}</p>
							</div>
						</div>

						<div className="project-date">
							<div className="created-container">
								<p>Created</p>
								<p>{dateFormatter(projectData.projectCreatedAt).otherDate}</p>
							</div>
							<div className="deadline-container">
								<p>Deadline</p>
								<p>
									{dateFormatter(projectData.projectDateOfDeadline).otherDate}
								</p>
							</div>
						</div>
						<div className="project-deadline-count">
							<div className="days-lapsed">
								<p>Days Lapsed</p>
								<p>
									{
										daysDifference(
											projectData.projectDateOfDeadline,
											projectData.projectCreatedAt
										).creationDiffDays
									}
								</p>
							</div>
							<div className="days-till-deadline">
								<p>Days Until Deadline</p>
								<p>
									{
										daysDifference(
											projectData.projectDateOfDeadline,
											projectData.projectCreatedAt
										).deadlineDiffDays
									}
								</p>
							</div>
							<div className="days-till-deadline">
								<p>Project Length in days</p>
								<p>
									{daysDifference(
										projectData.projectDateOfDeadline,
										projectData.projectCreatedAt
									).creationDiffDays +
										daysDifference(
											projectData.projectDateOfDeadline,
											projectData.projectCreatedAt
										).deadlineDiffDays}
								</p>
							</div>
						</div>
						<div className="project-overall-task-count">
							<div className="active">
								<p>Active Tasks</p>
								<p>{taskData.activeTaskCount}</p>
							</div>
							<div className="completed">
								<p>Completed Tasks</p>
								<p>{taskData.completedTaskCount}</p>
							</div>
						</div>
						<div className="project-overall-task-count">
							<div className="overall">
								<p>Total Tasks</p>
								<p>{taskData.taskCount}</p>
							</div>

							<div className="lapsed">
								<p>Lapsed Tasks</p>
								<p>{taskData.lapsedTaskCount}</p>
							</div>
						</div>
						<div className="task-completion-daily">
							<div className="daily-completion">
								<p>Completion Rate</p>
								<p>
									{taskData.completedTaskCount &&
										taskData.completedTaskCount /
											daysDifference(
												projectData.projectDateOfDeadline,
												projectData.projectCreatedAt
											).creationDiffDays}{' '}
									tasks / day
								</p>
							</div>
						</div>
						<div className="task-completion-daily">
							<div className="daily-completion">
								<p>
									Target number of ongoing tasks to be completed each day before
									deadline
								</p>
								<p>
									{(
										taskData.activeTaskCount /
										(daysDifference(
											projectData.projectDateOfDeadline,
											projectData.projectCreatedAt
										).deadlineDiffDays -
											1)
									).toFixed(2)}
								</p>
							</div>
						</div>
					</div> */}
				</div>
			</div>
		);
	}

	if ((isLoading && isError) || isError) {
		return <ErrorResponse />;
	}

	return <LoadingWalkingMan />;
};

export default InfoPanel;

/* <p>
Have something like *you have 90 days before your deadline, that is
approx, 20 days per phase eme
</p>
<p>
you have 20 days alloted for this phase, you have 10 tasks all due in
one day, are you ok?
</p>
<br />
<ul>
<p>Things to put in this component</p>
<br />
<ul>
	<p>Project Data</p>
	<li>Project Name</li>
	<li>Project Description</li>
	<li>Nature of project</li>
	<br />
	<p>Important Dates</p>
	<li>days since project creation</li>
	<li>day today</li>
	<li>days before deadline</li>
	<li>date of deadline edit form</li>
	<br />
	<p>phase data</p>
	<li>date of first task</li>
	<li>date of last task</li>
	<li>total number of days inside phase</li>
	<li>number of tasks</li>
	<li>completed tasks</li>
	<li>priority tasks</li>
	<br />
	<li>completed</li>
	<li>completed -normal</li>
	<li>completed -priority</li>
	<li>completed -deleted</li>
	<br />
	<li>deleted tasks inside phase</li>
	<br />
	<p>Aggregated tasks data</p>
	<p>Overall count of the ff:</p>
	<li>normal tasks</li>
	<li>priority tasks</li>
	<br />
	<li>completed</li>
	<li>completed -normal</li>
	<li>completed -priority</li>
	<li>completed -deleted</li>
	<br />
	<li>deleted tasks</li>
	<br />
	<li>LAPSED TASKS </li>
</ul>
</ul> */
