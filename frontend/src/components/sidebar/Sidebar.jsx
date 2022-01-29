import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const Sidebar = () => {
	const { pathname } = useLocation();

	const [isSideBarOpen, isSideBarOpenHandler] = useState(true);

	useEffect(() => {
		Cookies.remove('datask-currentPhase');
		Cookies.remove('datask-currentProject');
	});

	return (
		<div
			className={
				isSideBarOpen
					? 'sidebar-container sidebar-big'
					: 'sidebar-container sidebar-small '
			}
		>
			<div
				className={
					isSideBarOpen
						? 'sidebar-container-logo'
						: 'sidebar-container-logo logo-move-left'
				}
			>
				<p className="logo">datetask.</p>
			</div>

			<div className="sidebar-container-constant">
				<div id="menu-slider" className="sidebar-link">
					<div
						onClick={() => isSideBarOpenHandler((e) => !e)}
						className=" menu-icon"
					>
						<span
							className="iconify"
							data-icon="heroicons-outline:menu"
							data-inline="false"
							title="Menu"
						></span>
					</div>
				</div>

				<div className="sidebar-link">
					<span
						className="iconify"
						data-icon="bx:bx-help-circle"
						data-inline="false"
						title="Help"
					></span>
				</div>
			</div>

			<div className="sidebar-compact">
				<NavLink
					activeClassName="active-navlink"
					to="/dashboard"
					className="sidebar-compact-container"
				>
					<div className="sidebar-compact-container-link">
						<span
							className="iconify"
							data-icon="akar-icons:home"
							data-inline="false"
							title="Home"
						></span>
					</div>
					<p>Dashboard</p>
				</NavLink>

				<NavLink
					activeClassName="active-navlink"
					to="/notes"
					className="sidebar-compact-container"
				>
					<div className="sidebar-compact-container-link">
						<span
							className="iconify"
							data-icon="ic:outline-sticky-note-2"
							data-inline="false"
							title="Notes"
						></span>
					</div>
					<p>Notes</p>
				</NavLink>

				<NavLink
					activeClassName="active-navlink"
					to="/statistics"
					className="sidebar-compact-container"
				>
					<div className="sidebar-compact-container-link">
						<span
							className="iconify"
							data-icon="heroicons-outline:chart-square-bar"
							data-inline="false"
							title="Data"
						></span>
					</div>
					<p>Statistics</p>
				</NavLink>

				<NavLink
					activeClassName="active-navlink"
					to="/projects"
					isActive={() => ['/projects', '/timeline'].includes(pathname)}
					className="sidebar-compact-container"
					onClick={() => {
						Cookies.remove('datask-currentPhase');
						Cookies.remove('datask-currentProject');
					}}
				>
					<div className="sidebar-compact-container-link">
						<span
							className="iconify"
							data-icon="akar-icons:file"
							data-inline="false"
							title="Projects"
						></span>
					</div>
					<p>Projects</p>
				</NavLink>

				<div
					className="sidebar-compact-container logout"
					onClick={() => {
						Cookies.remove('datask-currentPhase');
						Cookies.remove('datask-currentProject');
						Cookies.remove('datask-currentUser');
						window.location.reload();
					}}
				>
					<div className="sidebar-compact-container-link">
						<span
							className="iconify"
							data-icon="websymbol:logout"
							data-inline="false"
							title="logout"
						></span>
					</div>
					<p>Logout</p>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
