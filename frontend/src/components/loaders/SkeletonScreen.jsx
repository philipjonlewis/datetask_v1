import React from 'react';

const SkeletonScreen = ({ card, dashboard }) => {
	return (
		<div className="skeleton-container">
			<div className="skeleton-card-01">
				<div className="skeleton-box-xl"></div>
				<div className="skeleton-box-text-xl"></div>
				<div className="skeleton-box-text-l"></div>
				<div className="skeleton-box-text-s"></div>
				<div className="skeleton-box-text-l"></div>
				<div className="skeleton-box-text-xl"></div>
				<div className="skeleton-box-l"></div>
				<div className="skeleton-box-text-m"></div>
				<div className="skeleton-box-text-s"></div>
				<div className="skeleton-box-l"></div>
				<div className="skeleton-box-text-s"></div>
				<div className="skeleton-box-text-m"></div>
				<div className="skeleton-box-text-xl"></div>
				<div className="skeleton-box-text-l"></div>
				<div className="skeleton-box-text-xl"></div>
			</div>
			<div className="skeleton-card-02">
				<div className="skeleton-box-text-xl"></div>
				<div className="skeleton-box-text-l"></div>
				<div className="skeleton-box-l"></div>
				<div className="skeleton-box-xl"></div>
				<div className="skeleton-box-text-l"></div>
				<div className="skeleton-box-text-s"></div>
				<div className="skeleton-box-xl"></div>
				<div className="skeleton-box-text-s"></div>
				<div className="skeleton-box-text-s"></div>
				<div className="skeleton-box-text-l"></div>
			</div>
			<div className="skeleton-card-03">
				<div className="skeleton-box-text-xl"></div>
				<div className="skeleton-box-text-l"></div>
				<div className="skeleton-box-text-s"></div>
				<div className="skeleton-box-l"></div>
				<div className="skeleton-box-l"></div>
				<div className="skeleton-box-xl"></div>
				<div className="skeleton-box-text-s"></div>
				<div className="skeleton-box-text-m"></div>
			</div>

			<div className="skeleton-card-02">
				<div className="skeleton-box-l"></div>
				<div className="skeleton-box-xl"></div>
				<div className="skeleton-box-text-m"></div>
				<div className="skeleton-box-text-s"></div>
				<div className="skeleton-box-l"></div>
				<div className="skeleton-box-text-l"></div>
				<div className="skeleton-box-l"></div>
				<div className="skeleton-box-text-xl"></div>
				<div className="skeleton-box-text-s"></div>
				<div className="skeleton-box-text-m"></div>
			</div>
			<div className="skeleton-card-03">
				<div className="skeleton-box-text-xl"></div>
				<div className="skeleton-box-text-l"></div>
				<div className="skeleton-box-l"></div>
				<div className="skeleton-box-text-m"></div>
				<div className="skeleton-box-xl"></div>
				<div className="skeleton-box-text-l"></div>
				<div className="skeleton-box-text-s"></div>
			</div>
		</div>
	);
};

export default SkeletonScreen;
