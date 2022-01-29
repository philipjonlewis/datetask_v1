import React, { useState, useEffect, Fragment } from 'react';

import LapsedList from './LapsedList';

import { dateFormatter } from '../../../middleware/dateFormatter';

const LapsedCard = ({ card }) => {
	const [isLoading, isLoadingHandler] = useState(true);
	const [isDroppedDown, isDroppedDownHandler] = useState(false);

	const [taskList, taskListHandler] = useState([]);
	const [cardDate, cardDateHandler] = useState(null);

	useEffect(() => {
		console.log('repeater');
		if (card) {
			taskListHandler(card.tasks);
			cardDateHandler(card.dateOfDeadline);
			isLoadingHandler(false);
		}
	}, [card]);

	if (!isLoading) {
		return (
			<div className="lapsed-card-container">
				<div className="lapsed-date-container">
					<div className="dates">
						<p>{dateFormatter(cardDate).displayDate}</p>
						<p>{dateFormatter(cardDate).dayOfWeek}</p>
					</div>
					<div
						className={
							!isDroppedDown
								? 'dropdown-btn-container'
								: 'dropdown-btn-container transform-180'
						}
						onClick={() => {
							isDroppedDownHandler((e) => !e);
						}}
					>
						<span
							className="iconify"
							data-icon="bx:bx-chevron-down-circle"
							data-inline="false"
						></span>
					</div>
				</div>
				<div
					className={
						!isDroppedDown
							? 'lapsed-drop-down'
							: 'lapsed-drop-down drop-down-activate'
					}
				>
					<div className="lapsed-label">
						<p>Completed Tasks</p>
					</div>
					<div className="lapsed-division-container">
						{taskList
							.filter((task) => task.isCompleted)
							.map((task) => {
								return (
									<Fragment key={task._id}>
										<LapsedList task={task} taskListHandler={taskListHandler} />
									</Fragment>
								);
							})}
					</div>
					<div className="lapsed-label">
						<p>Lapsed Tasks</p>
					</div>
					<div className="lapsed-division-container">
						{taskList
							.filter((task) => !task.isCompleted)
							.map((task) => {
								return (
									<Fragment key={task._id}>
										<LapsedList task={task} taskListHandler={taskListHandler} />
									</Fragment>
								);
							})}
					</div>
				</div>
			</div>
		);
	}

	return <></>;
};

export default LapsedCard;
