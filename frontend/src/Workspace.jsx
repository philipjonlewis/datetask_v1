import React, { useState, useEffect, useRef, useContext } from 'react';

import { verifyUser } from './middleware/userRouteRequests';

import { ProjectContext } from './contexts/ProjectContext';

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';

import Sidebar from './components/sidebar/Sidebar.jsx';

import Dashboard from './components/dashboard/Dashboard';
import Notes from './components/notes/Notes';
import Statistics from './components/statistics/Statistics';
import Projectboard from './components/projectboard/Projectboard';
import ProjectTimeline from './components/projectboard/projecttimeline/ProjectTimeline';

import UpperNavbar from './components/headers/UpperNavbar';

const Workspace = () => {
	const _isMounted = useRef(true);

	const [userName, userNameHandler] = useState('Guest');

	const [projectDetails, setProjectDetails] = useState({
		projectName: null,
		projectDescription: null,
	});

	useEffect(() => {
		if (_isMounted) {
			if (localStorage.getItem('datask-logInForm')) {
				userNameHandler(JSON.parse(localStorage.getItem('datask-logInForm')));
			} else {
				verifyUser().then((res) => {
					localStorage.setItem(
						'datask-logInForm',
						JSON.stringify(res.payload.username)
					);
					userNameHandler(res.payload.username);
				});
			}
		}
	}, []);

	useEffect(() => {
		return () => {
			_isMounted.current = false;
		};
	}, []);

	return (
		<Router>
			<ProjectContext.Provider value={{ projectDetails, setProjectDetails }}>
				<div className="workspace-container">
					<Sidebar />
					<div className="workspace-proper">
						<div className="navbars-container">
							<UpperNavbar currentUser={userName} />
						</div>

						<div className="workspace-router-container">
							<Redirect exact from="/" to="/dashboard" />
							<Switch>
								<Route exact path="/dashboard">
									<Dashboard currentUser={userName} />
								</Route>
								<Route exact path="/notes">
									<Notes />
								</Route>
								<Route exact path="/statistics">
									<Statistics />
								</Route>
								<Route exact path="/projects">
									<Projectboard />
								</Route>
								<Route exact path="/timeline">
									<ProjectTimeline />
								</Route>
							</Switch>
						</div>
					</div>
				</div>
			</ProjectContext.Provider>
		</Router>
	);
};

export default Workspace;
