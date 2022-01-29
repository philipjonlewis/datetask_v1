import React, { useEffect, useContext } from 'react';
import Cookies from 'js-cookie';

import { ProjectContext } from '../../contexts/ProjectContext';

const UpperNavbar = ({ currentUser }) => {
	const { projectDetails, setProjectDetails } = useContext(ProjectContext);

	return (
		<>
			<div className="upper-navbar-container">
				<div className="upper-navbar-title">
					<p>{projectDetails.projectName && projectDetails.projectName}</p>
					<p>
						{projectDetails.projectDescription &&
							projectDetails.projectDescription}
					</p>
				</div>
				<div className="upper-navbar-info-container">
					<div className="upper-navbar-search-container">
						<span
							className="iconify"
							data-icon="akar-icons:search"
							data-inline="false"
						></span>
						<span
							className="iconify"
							data-icon="bi:filter-right"
							data-inline="false"
						></span>
					</div>
					<div className="upper-navbar-user-container">
						<span
							className="iconify"
							data-icon="gg:profile"
							data-inline="false"
						></span>
						<p>{currentUser}</p>
						<span
							className="iconify"
							data-icon="bi:caret-down"
							data-inline="false"
						></span>
					</div>
				</div>
			</div>
			<div className="lower-navbar-container">
				<div className="lower-navbar-subtitle">
					<p></p>
				</div>
				<div className="lower-navbar-alert-container">
					<span
						className="iconify"
						data-icon="carbon:notification"
						data-inline="false"
					></span>
					<span
						className="iconify"
						data-icon="teenyicons:message-text-alt-outline"
						data-inline="false"
					></span>
				</div>
			</div>
		</>
	);
};

export default UpperNavbar;
