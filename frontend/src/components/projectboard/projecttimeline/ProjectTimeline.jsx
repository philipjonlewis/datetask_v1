import React, { useState, useEffect, useRef } from 'react';

import { getPhase, getPhases } from '../../../middleware/phaseRouteRequests';
import {
	getCurrentProject,
	getProject,
} from '../../../middleware/projectRouteRequests';

import SkeletonScreen from '../../loaders/SkeletonScreen';

import ErrorResponse from '../../stateresponses/ErrorResponse';

import CardBoard from '../cardboard/CardBoard';
import InfoPanel from '../infopanel/InfoPanel';
import PhaseContainer from '../phasecontainer/PhaseContainer';

const ProjectTimeline = ({ projectDetailsHandler }) => {
	const _isMounted = useRef(true);

	const [isLoading, isLoadingHandler] = useState(true);
	const [isError, isErrorHandler] = useState(false);

	const [currentPhase, currentPhaseHandler] = useState(null);
	const [phaseList, phaseListHandler] = useState([]);

	useEffect(() => {
		if (_isMounted) {
			setTimeout(() => {
				try {
					getPhases()
						.then((res) => {
							if (res.status && res.payload.length >= 1) {
								let newList = res.payload.sort((a, b) => {
									return a.phaseOrder - b.phaseOrder;
								});

								phaseListHandler(newList);
							}
							isLoadingHandler(false);
						})
						.catch((err) => {
							throw new Error(err);
						});
				} catch (error) {
					console.log(error);
					isErrorHandler(true);
				}
			}, 1000);
		}
	}, []);

	useEffect(() => {
		if (_isMounted && currentPhase) {
			getPhase(currentPhase._id);
		}
	}, [currentPhase]);

	useEffect(() => {
		return () => {
			_isMounted.current = false;
		};
	}, []);

	if (!isLoading && !isError) {
		return (
			<div className="projecttimeline-container">
				<div className="projecttimeline-infopanel-container">
					<div className="projecttimeline-proper">
						<PhaseContainer
							phaseList={phaseList}
							currentPhaseHandler={currentPhaseHandler}
							currentPhase={currentPhase}
						/>
						{!currentPhase && (
							<InfoPanel
								phaseList={phaseList}
								phaseListHandler={phaseListHandler}
							/>
						)}

						{currentPhase && (
							<CardBoard
								currentPhase={currentPhase}
								currentPhaseHandler={currentPhaseHandler}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}

	if ((isLoading && isError) || isError) {
		return <ErrorResponse />;
	}

	return <SkeletonScreen />;
};

export default ProjectTimeline;
