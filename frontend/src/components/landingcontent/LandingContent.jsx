import React from 'react';

const LandingContent = ({ logInForm, signUpFormhandler, logInFormHandler }) => {
	return (
		<div
			className="landingPage-container-content "
			onClick={() => {
				signUpFormhandler(false);
				logInFormHandler(false);
			}}
		>
			<div className={logInForm ? 'login-frosted' : 'login-unfrosted'}></div>

			<div className="homepage-container">
				<div className="hero-container">
					<div className="description">
						<h1>The new way to work</h1>
						<h4>Data Driven Decision Making </h4>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius
							doloremque eaque, ab omnis repellendus quod asperiores et culpa
							soluta rem mollitia ipsa iusto optio sed quisquam debitis
							doloribus.
						</p>
					</div>
					<div>
						<img
							src="https://web3canvas.com/wp-content/uploads/2018/12/custom-illustration-isometric.jpg"
							alt=""
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LandingContent;
