import './scss/components/_landing.scss';
import './scss/components/_workspace.scss';
import './scss/components/_dashboard.scss';
import './scss/components/_headers.scss';
import './scss/components/_landingcontent.scss';
import './scss/components/_loading.scss';
import './scss/components/_login.scss';
import './scss/components/_notes.scss';
import './scss/components/_sidebar.scss';
import './scss/components/_signup.scss';
import './scss/components/_statistics.scss';
import './scss/components/_projectboard.scss';

import './scss/components/_addphaseform.scss';
import './scss/components/_addprojectform.scss';
import './scss/components/_addtaskcardform.scss';

import './scss/components/_cardboard.scss';
import './scss/components/_cardcontainer.scss';
import './scss/components/_taskcontainer.scss';

import './scss/components/_infopanel.scss';
import './scss/components/_phasecontainer.scss';
import './scss/components/_projectcard.scss';
import './scss/components/_projecttimeline.scss';
import './scss/components/_taskhistory.scss';
import './scss/components/_skeletonscreen.scss';

import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

import { verifyUser } from './middleware/userRouteRequests';

import LoadingBook from './components/loaders/LoadingBook';
import LandingPage from './LandingPage';
import Workspace from './Workspace';

function App() {
	const _isMounted = useRef(true);

	const [isLoading, isLoadingHandler] = useState(true);
	const [isLoggedIn, isLoggedInHandler] = useState(false);

	useEffect(() => {
		if (_isMounted) {
			const dataskCookie = Cookies.get('datask-currentUser');

			if (dataskCookie) {
				verifyUser().then((res) => {
					console.log('running');
					if (res.status) {
						return isLoggedInHandler(true);
					} else {
						Cookies.remove('datask-currentPhase');
						Cookies.remove('datask-currentProject');
						Cookies.remove('datask-currentUser');
						return isLoggedInHandler(false);
					}
				});
			}
			
			setTimeout(() => {
				isLoadingHandler(false);
			}, 2000);
		}
	}, []);

	useEffect(() => {
		return () => {
			_isMounted.current = false;
		};
	}, []);

	if (isLoading) {
		return <LoadingBook />;
	}

	if (isLoggedIn) {
		return <Workspace />;
	}

	if (!isLoggedIn) {
		return <LandingPage />;
	}
}

export default App;
