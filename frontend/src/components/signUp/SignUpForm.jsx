import React from 'react';

const SignUpForm = () => {
	return (
		<div className="signup-form-container">
			<div className="signup-form-proper">
				<div className="signup-leftside-container">
					{/* <p>Sign Up Now!</p> */}
				</div>
				<div className="signup-rightside-container">
					<div className="signup-text-container">
						<p> Sign Up</p>
					</div>
					{/* <div className="signup-error-container">
						<p>This is the error container</p>
					</div> */}
					<form className="signup-form">
						<div className="signup-names-container">
							<div className="signup-input-container">
								<label htmlFor="firstName">First Name</label>
								<input type="text" required autoComplete="on" />
							</div>
							<div className="signup-input-container">
								<label htmlFor="lastName">Last Name</label>
								<input type="text" required autoComplete="on" />
							</div>
						</div>
						<div className="signup-input-container">
							<label htmlFor="username">Username</label>
							<input type="text" required autoComplete="on" />
						</div>
						<div className="signup-input-container">
							<label htmlFor="email">Email</label>
							<input type="email" required autoComplete="on" />
						</div>
						<div className="signup-input-container">
							<label htmlFor="password">Password</label>
							<input type="password" required autoComplete="on" />
						</div>
						<div className="signup-input-container">
							<label htmlFor="passwordConfirmation">
								Password Confirmation
							</label>
							<input type="passwordConfirmation" required autoComplete="on" />
						</div>

						<button type="submit" className="signup-btn-container">
							Sign Up
						</button>
					</form>
					<div className="signup-or-container">
						<p>or log in with the following</p>
					</div>

					<div className="external-login-container">
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
				</div>
			</div>
		</div>
	);
};

export default SignUpForm;
