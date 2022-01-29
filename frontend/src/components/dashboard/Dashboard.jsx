import React, { useState, useEffect, useRef } from 'react';


import LoadingWalkingMan from '../loaders/LoadingWalkingMan';

const Dashboard = ({ currentUser }) => {
	const _isMounted = useRef(true);

	const [isFetchingUserData, isFetchingUserDataHandler] = useState(true);

	useEffect(() => {
		if (_isMounted) {
			try {
				isFetchingUserDataHandler(false);
			} catch (error) {
				isFetchingUserDataHandler(true);
			}
		}
	}, []);

	useEffect(() => {
		return () => {
			_isMounted.current = false;
		};
	}, []);

	if (!isFetchingUserData) {
		return (
			<div className="home-container">
				<div className="user-greetings">
					Hi {currentUser},<br /> Welcome Back.
				</div>
			</div>
		);
	}

	return <LoadingWalkingMan message={'Partitioning Social Network'} />;
};

export default Dashboard;
