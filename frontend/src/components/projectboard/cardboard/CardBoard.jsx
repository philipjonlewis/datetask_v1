import React, { useState, useEffect, useRef } from 'react';

import {
	getCards,
	getLapsedCards,
	deleteCard,
} from '../../../middleware/cardRouteRequests';

import SkeletonScreen from '../../loaders/SkeletonScreen';
import AddTaskCardForm from '../addresourceforms/addtaskcardform/AddTaskCardForm';

import CardContainer from '../cardcontainer/CardContainer';
import TaskHistory from '../taskhistory/TaskHistory';

const CardBoard = ({ currentPhase, currentPhaseHandler }) => {
	const _isMounted = useRef(true);

	const [isLoading, isLoadingHandler] = useState(true);

	const [cardList, cardListHandler] = useState(null);

	const [newTaskAndCardTrigger, newTaskAndCardTriggerHandler] = useState(false);
	const [isAddTaskCardFormOpen, isAddTaskCardFormOpenHandler] = useState(false);
	const [isLapsedTasksFormOpen, isLapsedTasksFormOpenHandler] = useState(false);

	const [lapsedTasks, lapsedTasksHandler] = useState([]);

	useEffect(() => {
		if (_isMounted && currentPhase) {
			isLoadingHandler(true);
			setTimeout(() => {
				getCards()
					.then((res) => {
						if (res.status) {
							cardListHandler(res.payload);
						}
					})
					.then(() => {
						getLapsedCards().then((res) => {
							console.log(res);
							if (res.status) {
								lapsedTasksHandler(res.payload);
								isLoadingHandler(false);
							}
						});
					});
			}, 1000);
		}
	}, [currentPhase]);

	const deleteCardHandler = async (id) => {
		cardListHandler((prevList) => {
			const newList = prevList.filter((card) => card._id !== id);
			return newList;
		});
		deleteCard(id);
	};

	useEffect(() => {
		if (_isMounted) {
			newTaskAndCardTriggerHandler(false);
		}
	}, [newTaskAndCardTrigger]);

	useEffect(() => {
		return () => {
			_isMounted.current = false;
		};
	}, []);

	if (!isLoading) {
		return (
			<div className="cardboard-container">
				{!isLapsedTasksFormOpen && lapsedTasks.length !== 0 && (
					<div
						className="lapsed-tasks-btn-container"
						onClick={() => isLapsedTasksFormOpenHandler((e) => !e)}
					>
						<span
							className="iconify"
							data-icon="fluent:history-24-filled"
							data-inline="false"
							title="Task History"
						></span>
					</div>
				)}
				<TaskHistory
					isLapsedTasksFormOpen={isLapsedTasksFormOpen}
					isLapsedTasksFormOpenHandler={isLapsedTasksFormOpenHandler}
					lapsedTasks={lapsedTasks}
				/>

				<div
					className="card-list-container"
					onClick={() => isAddTaskCardFormOpenHandler(false)}
					onMouseEnter={() => {
						isAddTaskCardFormOpenHandler(false);
					}}
				>
					{cardList.length >= 1 &&
						cardList.map((card) => {
							return (
								<CardContainer
									key={card._id}
									_id={card._id}
									dateOfDeadline={card.dateOfDeadline}
									tasks={card.tasks}
									deleteCardHandler={deleteCardHandler}
								/>
							);
						})}
					<div className="empty-card-div">To provide space</div>
				</div>

				<div
					className={
						isAddTaskCardFormOpen
							? 'add-taskcard-slider-btn-container transform-45'
							: 'add-taskcard-slider-btn-container'
					}
					onClick={(e) => isAddTaskCardFormOpenHandler((e) => !e)}
				>
					<span
						className="iconify"
						data-icon="gg:add"
						data-inline="false"
					></span>
				</div>

				<AddTaskCardForm
					isAddTaskCardFormOpen={isAddTaskCardFormOpen}
					cardListHandler={cardListHandler}
					cardList={cardList}
					newTaskAndCardTriggerHandler={newTaskAndCardTriggerHandler}
				/>
			</div>
		);
	}

	return <SkeletonScreen />;
};

export default CardBoard;
