import React, { useState, useEffect, useRef } from 'react';

const PhaseContainer = ({ phaseList, currentPhase, currentPhaseHandler }) => {
	const _isMounted = useRef(true);

	const [isLoading, isLoadingHandler] = useState(true);

	useEffect(() => {
		if (_isMounted) {
			isLoadingHandler(false);
		}
	}, []);

	useEffect(() => {
		return () => {
			_isMounted.current = false;
		};
	}, []);

	if (!isLoading) {
		return (
			<div className="phasecontainer-container">
				<div
					className={
						currentPhase
							? 'project-infoboard-container'
							: 'project-infoboard-container infoboard-active'
					}
					onClick={() => {
						currentPhaseHandler(null);
					}}
				>
					<span
						className="iconify"
						data-icon="bi:clipboard-data"
						data-inline="false"
					></span>
				</div>
				{phaseList.length >= 1 ? (
					phaseList.map((phase) => {
						return (
							<div
								className={
									currentPhase === phase
										? 'phasename-container active-phase'
										: 'phasename-container'
								}
								key={phase._id}
								onClick={() => {
									currentPhaseHandler(phase);
								}}
							>
								<button>{phase.phaseName}</button>
							</div>
						);
					})
				) : (
					<div className="phasename-container empty-phase-container">
						<p className="empty-phase-message">No new phases</p>
					</div>
				)}
			</div>
		);
	}

	return <span></span>;
};

export default PhaseContainer;
