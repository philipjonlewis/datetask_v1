import React from 'react';

import empty from '../../styling/empty.png';

const EmptyResponse = ({ message }) => {
	return (
		<div className="empty-container">
			<div className="empty-image">
				<img src={empty} alt="" />
			</div>
			<div className="empty-message">
				<p>Hey!</p>
				<p>What are you waiting for?</p>
				<p>All it takes is just one step</p>
				<p>{message}</p>
			</div>
		</div>
	);
};

EmptyResponse.defaultProps = {
	message: 'Start a project today!',
};

export default EmptyResponse;
