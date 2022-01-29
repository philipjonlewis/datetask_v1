import React, { useState, useEffect, useRef } from 'react';
import { getProjects } from '../../middleware/projectRouteRequests';

import ProjectCard from './projectcard/ProjectCard';
import LoadingWalkingMan from '../loaders/LoadingWalkingMan';
import AddProjectForm from './addresourceforms/addprojectform/AddProjectForm';

import ErrorResponse from '../stateresponses/ErrorResponse';
import EmptyResponse from '../stateresponses/EmptyResponse';

const ProjectBoard = ({ projectDetailsHandler }) => {
	const _isMounted = useRef(true);

	const [isAddProjectFormOpen, isAddProjectFormOpenHandler] = useState(false);
	const [isLoading, isLoadingHandler] = useState(true);
	const [projectsUpdateTrigger, projectsUpdateTriggerHandler] = useState(false);
	const [projectList, projectListHandler] = useState([]);

	useEffect(() => {
		if (_isMounted) {
			try {
				// throw new Error('trial error');
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
						isLoadingHandler(false);
					})
					.catch((err) => {
						throw new Error(err);
					});
			} catch (error) {
				projectListHandler([
					{
						error: true,
					},
				]);
				projectsUpdateTriggerHandler(false);
				isLoadingHandler(false);
			}
		}
	}, [projectsUpdateTrigger]);

	useEffect(() => {
		return () => {
			_isMounted.current = false;
		};
	}, []);

	if (!isLoading) {
		return (
			<div className="projectboard">
				<div
					className={
						isAddProjectFormOpen
							? 'add-project-slider-btn-container transform-45'
							: 'add-project-slider-btn-container'
					}
					onClick={(e) => isAddProjectFormOpenHandler((e) => !e)}
				>
					<span
						className="iconify"
						data-icon="gg:add"
						data-inline="false"
					></span>
				</div>
				<div
					className="projectboard-container"
					onMouseEnter={() => isAddProjectFormOpenHandler(false)}
				>
					{projectList.length >= 1 ? (
						projectList.map((project) => {
							if (project.error) {
								return <ErrorResponse />;
							}
							return (
								<ProjectCard
									key={project._id}
									{...project}
									projectsUpdateTriggerHandler={projectsUpdateTriggerHandler}
									projectDetailsHandler={projectDetailsHandler}
								/>
							);
						})
					) : (
						<EmptyResponse />
					)}
				</div>
				<AddProjectForm
					isAddProjectFormOpen={isAddProjectFormOpen}
					projectsUpdateTriggerHandler={projectsUpdateTriggerHandler}
				/>
			</div>
		);
	}

	return <LoadingWalkingMan />;
};

export default ProjectBoard;
