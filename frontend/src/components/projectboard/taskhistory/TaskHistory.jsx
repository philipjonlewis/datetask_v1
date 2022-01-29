import React, { useState, useEffect, useRef, Fragment } from 'react';

import LapsedCard from './LapsedCard';

const TaskHistory = ({
	isLapsedTasksFormOpen,
	isLapsedTasksFormOpenHandler,
	lapsedTasks,
}) => {
	const _isMounted = useRef(true);

	const [isLoading, isLoadingHandler] = useState(true);
	const [lapsedCardList, lapsedCardListHandler] = useState(null);

	useEffect(() => {
		if (_isMounted && lapsedTasks.length >= 1) {
			lapsedCardListHandler(lapsedTasks);
			isLoadingHandler(false);
		}
	}, [lapsedTasks]);

	useEffect(() => {
		return () => {
			_isMounted.current = false;
		};
	}, []);

	if (!isLoading) {
		return (
			<div
				className={
					isLapsedTasksFormOpen
						? 'lapsed-tasks-container lapsed-slide-right'
						: 'lapsed-tasks-container'
				}
			>
				<div
					className="close-lapsed-form-btn-container transform-45"
					onClick={() => isLapsedTasksFormOpenHandler(false)}
				>
					<span
						className="iconify"
						data-icon="gg:add"
						data-inline="false"
						title="closed lapsed menu"
					></span>
				</div>
				<div className="lapsed-header-container">
					<p>Task History</p>
					<p>
						Organize lapsed and completed tasks here. add some instructions or
						maybe reminders
					</p>
				</div>
				<div className="lapsed-task-list-container">
					{lapsedCardList.map((card) => {
						return (
							<Fragment key={card._id}>
								<LapsedCard card={card} />
							</Fragment>
						);
					})}
				</div>
			</div>
		);
	}

	return <span></span>;
};

export default TaskHistory;
