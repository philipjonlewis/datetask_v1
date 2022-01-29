import React, { useEffect, useRef } from 'react';
import LoadingWalkingMan from '../../loaders/LoadingWalkingMan';

import { Link } from 'react-router-dom';

import {
	getProject,
	deleteProject,
} from '../../../middleware/projectRouteRequests';

const ProjectCard = ({
	_id,
	projectName,
	projectDescription,
	natureOfProject,
	projectImage,
	projectsUpdateTriggerHandler,
}) => {
	const _isMounted = useRef(true);

	const deleteProjectHandler = (id) => {
		if (_isMounted) {
			deleteProject(id).then((res) => {
				if (res.status) {
					projectsUpdateTriggerHandler(true);
				}
			});
		}
	};

	useEffect(() => {
		return () => {
			_isMounted.current = false;
		};
	}, []);

	if (!projectName) {
		return <LoadingWalkingMan single={'single'} />;
	}

	return (
		<div className="project-card-container">
			<div
				className="delete-project-btn-container"
				onClick={() => {
					deleteProjectHandler(_id);
				}}
			>
				<div className="delete-btn">
					<span
						className="iconify"
						data-icon="fluent:delete-16-regular"
						data-inline="false"
						title="Delete Project"
					></span>
				</div>
			</div>
			<div className="image-container">
				<img src={projectImage} alt="" />
			</div>
			<div className="text-container">
				<p className="project-name">{projectName}</p>
				<p className="project-description">{projectDescription}</p>
				<p className="project-nature">{natureOfProject}</p>

				<Link to="/timeline" className="enter-project">
					<span
						className="iconify"
						data-icon="ion:enter-outline"
						data-inline="false"
					></span>
					<div
						onClick={() => {
							getProject(_id);
						}}
					>
						<p> Go to Project</p>
					</div>
				</Link>
			</div>
		</div>
	);
};

export default ProjectCard;
