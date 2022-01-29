import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

import { logInRouteRequest } from '../../middleware/userRouteRequests';

const LogIn = ({ userAuthSuccessHandler, logInForm }) => {
	const _isMounted = useRef(true);

	const [formContent, formHandler] = useState({
		username: '',
		password: '',
	});

	const [logInError, logInErrorHandler] = useState('');

	useEffect(() => {
		const username = JSON.parse(localStorage.getItem('datask-logInForm'));
		if (username) {
			formHandler((p) => {
				return { ...p, username };
			});
		}
	}, []);

	const submitHandler = async (e) => {
		e.preventDefault();
		Cookies.remove('datask-currentUser');
		if (_isMounted) {
			logInRouteRequest(formContent).then((res) => {
				if (!res.status) {
					logInErrorHandler('User already exists');
					setTimeout(() => logInErrorHandler(''), 5000);
				} else {
					userAuthSuccessHandler(true);
				}
			});
		}
	};

	useEffect(() => {
		return () => {
			_isMounted.current = false;
		};
	}, []);

	return (
		<div
			className={
				logInForm
					? 'login-form-container login-form-opened'
					: 'login-form-container login-form-closed'
			}
		>
			<div className="login-form-proper">
				<div className="login-alert-container">
					<div className="login-alert-message">
						{logInError.length >= 1 && (
							<div>
								<span
									className="iconify"
									data-icon="feather:alert-triangle"
									data-inline="false"
								></span>
								<p>{logInError}</p>
							</div>
						)}
					</div>
				</div>

				<div className="login-container">
					<div className="login-external-container">
						<div className="login-external-text-container">
							{/* <p>Log-in using</p> */}
						</div>
						<div className="google-container external-logo-container">
							<span
								className="iconify"
								data-icon="bi:google"
								data-inline="false"
							></span>
							<p>google</p>
						</div>
						<div className="facebook-container external-logo-container">
							<span
								className="iconify"
								data-icon="brandico:facebook"
								data-inline="false"
							></span>
							<p>facebook</p>
						</div>
						<div className="twitter-container external-logo-container">
							<span
								className="iconify"
								data-icon="brandico:twitter"
								data-inline="false"
							></span>
							<p>twitter</p>
						</div>
						<div className="linkedin-container external-logo-container">
							<span
								className="iconify"
								data-icon="brandico:linkedin"
								data-inline="false"
							></span>
							<p>linkedin</p>
						</div>
						<div className="github-container external-logo-container">
							<span
								className="iconify"
								data-icon="bytesize:github"
								data-inline="false"
							></span>
							<p>github</p>
						</div>
					</div>

					<div className="login-internal-container">
						<form onSubmit={submitHandler}>
							<div className="username-password-container">
								<div className="login-username-container">
									<label htmlFor="username">username</label>
									<input
										type="text"
										name="username"
										id="username"
										placeholder="Insert username here"
										spellCheck="false"
										value={formContent.username}
										onChange={(e) => {
											localStorage.setItem(
												'datask-logInForm',
												JSON.stringify(e.target.value)
											);

											formHandler((p) => {
												return { ...p, [e.target.name]: e.target.value };
											});
										}}
										required
										autoComplete="on"
									/>
								</div>
								<div className="login-password-container">
									<label htmlFor="password">password</label>
									<input
										type="password"
										name="password"
										id="password"
										placeholder="Insert password here"
										value={formContent.password}
										onChange={(e) => {
											formHandler((p) => {
												return { ...p, [e.target.name]: e.target.value };
											});
										}}
										required
										autoComplete="on"
									/>
								</div>
								<button type="submit" className="login-btn-container">
									Log In
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LogIn;
