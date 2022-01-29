import React from 'react';
import loading from '../../styling/walking-man.gif';

const LoadingWalkingMan = ({ single, message }) => {
	return (
		<div
			className={
				single ? 'loading-card-container-single' : 'loading-card-container'
			}
		>
			<div>
				<img src={loading} alt="Loading..." />
				<p>{message ? message : 'Loading'}</p>
			</div>
		</div>
	);
};

export default LoadingWalkingMan;
