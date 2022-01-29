import React from 'react';
import loading from '../../styling/Book.gif';

const LoadingWalkingMan = () => {
	return (
		<div className="loading-book-container">
			<div>
				<img src={loading} alt="Loading..." />
				<p>Loading</p>
			</div>
		</div>
	);
};

export default LoadingWalkingMan;
