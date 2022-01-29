import React, { useState, useEffect, useRef } from 'react';
import { getProjects } from '../../../middleware/projectRouteRequests';

import ProjectCard from '../projectcard/ProjectCard';
import LoadingWalkingMan from '../../loaders/LoadingWalkingMan';
import AddProjectForm from '../addresourceforms/AddProjectForm';

const ProjectList = () => {
	const _isMounted = useRef(true);

	const [addProjectForm, addProjectFormHandler] = useState(false);
	const [projectsUpdateTrigger, projectsUpdateTriggerHandler] = useState(false);
	const [projectList, projectListHandler] = useState([]);

	useEffect(() => {
		if (_isMounted) {
			getProjects()
				.then((res) => {
					if (res.status && res.payloadCount >= 1) {
						projectListHandler(() => {
							const projects = res.payload;
							return projects;
						});
					}
				})
				.then(() => {
					projectsUpdateTriggerHandler(false);
				});
		}
	}, [projectsUpdateTrigger]);

	useEffect(() => {
		return () => {
			_isMounted.current = false;
		};
	}, []);

	if (projectList.length <= 0) {
		return <LoadingWalkingMan />;
	}

	return (
		<div className="projectboard">
			<div
				className="addproject-button-container"
				onClick={() => {
					addProjectFormHandler((e) => !e);
				}}
			>
				<span
					className="iconify"
					data-icon="fluent:add-circle-24-filled"
					data-inline="false"
					title="Add New Project"
				></span>
			</div>
			<div className="addproject-form-container">
				{addProjectForm && (
					<AddProjectForm
						projectsUpdateTriggerHandler={projectsUpdateTriggerHandler}
						addProjectFormHandler={addProjectFormHandler}
					/>
				)}
			</div>

			<div
				className="projectboard-container"
				onClick={() => addProjectFormHandler(false)}
			>
				{projectList.length >= 1 &&
					projectList.map((project) => {
						return (
							<ProjectCard
								key={project._id}
								{...project}
								projectsUpdateTriggerHandler={projectsUpdateTriggerHandler}
							/>
						);
					})}
			</div>
		</div>
	);
};

export default ProjectList;
