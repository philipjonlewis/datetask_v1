import React, { useState, useEffect, useRef } from 'react';

import SignUpForm from './components/signUp/SignUpForm';
import LogIn from './components/logIn/LogIn';
import LandingContent from './components/landingcontent/LandingContent';
import Workspace from './Workspace';

const LandingPage = () => {
	const _isMounted = useRef(true);

	const [signupForm, signUpFormhandler] = useState(false);
	const [logInForm, logInFormHandler] = useState(false);

	const [userAuthSuccess, userAuthSuccessHandler] = useState(false);

	useEffect(() => {
		return () => {
			_isMounted.current = false;
		};
	}, []);

	if (userAuthSuccess) {
		return <Workspace />;
	}

	return (
		<div className="landingPage-container">
			{signupForm && <SignUpForm />}
			{signupForm && (
				<div
					className={signupForm ? 'signup-frosted' : 'signup-unfrosted'}
					onClick={() => {
						signUpFormhandler(false);
						logInFormHandler(false);
					}}
				></div>
			)}

			<nav className="navbar-container">
				<div className="navbar-proper">
					<div className="logo-container">
						<p
							className="logo"
							onClick={() => {
								signUpFormhandler(false);
								logInFormHandler(false);
							}}
						>
							datetask.
						</p>
					</div>
					<div className="access-container">
						<div
							className="signup-btn-container"
							onClick={() => {
								signUpFormhandler((e) => !e);
							}}
						>
							<p className="signup-button">Sign Up</p>
						</div>
						<div
							className="login-btn-container"
							onClick={() => {
								logInFormHandler((e) => !e);
							}}
						>
							<p className="login-btn">{!logInForm && 'Log In'}</p>
						</div>
					</div>
				</div>
			</nav>

			<LogIn
				userAuthSuccessHandler={userAuthSuccessHandler}
				logInForm={logInForm}
			/>
			<LandingContent
				logInForm={logInForm}
				signUpFormhandler={signUpFormhandler}
				logInFormHandler={logInFormHandler}
			/>
		</div>
	);
};

export default LandingPage;
