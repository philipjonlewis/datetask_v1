import React, { useState, useEffect, useRef } from 'react';

import { v4 as uuidv4 } from 'uuid';

import {
	postTask,
	deleteTask,
	editTaskIsPriority,
	editTaskIsCompleted,
	editTaskContent,
} from '../../../middleware/taskRouteRequests';
import { dateFormatter } from '../../../middleware/dateFormatter';

import TaskContainer from './taskcontainer/TaskContainer';

const CardContainer = ({ _id, dateOfDeadline, tasks, deleteCardHandler }) => {
	const _isMounted = useRef(true);
	const [uuidTaskId, uuidTaskIdHandler] = useState(uuidv4());

	const [formContent, formHandler] = useState({
		content: '',
		dateOfDeadline: '',
		isCompleted: false,
		isPriority: false,
		_id: uuidTaskId,
	});

	const [isLoading, isLoadingHandler] = useState(true);
	const [isToday, isTodayHandler] = useState(false);
	const [allTasks, allTasksHandler] = useState([]);
	const [isCardMenuOpen, isCardMenuOpenHandler] = useState(false);

	const [currentTasks, currentTasksHandler] = useState({
		priorityTasks: [],
		normalTasks: [],
		completedTasks: [],
		completedPriority: [],
	});

	useEffect(() => {
		if (_isMounted) {
			allTasksHandler(tasks);
		}
	}, [tasks]);

	useEffect(() => {
		uuidTaskIdHandler(uuidv4());
		if (_isMounted) {
			currentTasksHandler((oldContent) => {
				let newContent = oldContent;

				const priorityTasks = allTasks.filter(
					(task) => task.isPriority && !task.isCompleted
				);
				const normalTasks = allTasks.filter(
					(task) => !task.isPriority && !task.isCompleted
				);

				const completedTasks = allTasks.filter(
					(task) => !task.isPriority && task.isCompleted
				);

				const completedPriority = allTasks.filter(
					(task) => task.isPriority && task.isCompleted
				);

				newContent.priorityTasks = priorityTasks;
				newContent.normalTasks = normalTasks;
				newContent.completedPriority = completedPriority;
				newContent.completedTasks = completedTasks;

				return newContent;
			});

			isLoadingHandler(false);

			dateOfDeadline &&
				formHandler((oldContents) => {
					return { ...oldContents, dateOfDeadline, _id: uuidTaskId };
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dateOfDeadline, allTasks]);

	useEffect(() => {
		let dateToday = new Date();
		dateToday.setHours(8, 0, 0, 0);
		const today = dateToday.toISOString().split('T')[0];

		let compareDateOfDeadline = new Date(dateOfDeadline);
		compareDateOfDeadline.setHours(8, 0, 0, 0);
		const valueForDateOfDeadline = compareDateOfDeadline
			.toISOString()
			.split('T')[0];

		if (today === valueForDateOfDeadline) {
			isTodayHandler(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (_isMounted) {
			const newId = uuidv4();
			uuidTaskIdHandler(newId);
		}
	}, [currentTasks]);

	const submitHandler = (e) => {
		e.preventDefault();
		uuidTaskIdHandler(uuidv4());

		formHandler((form) => {
			let newDeadline = new Date(form.dateOfDeadline);
			newDeadline.setHours(8, 0, 0, 0);

			return { ...form, dateOfDeadline: newDeadline };
		});

		if (_isMounted) {
			const isTaskExistingInCard = allTasks.some((task) => {
				return (
					task.content.toString().toLowerCase() ===
					formContent.content.toString().toLowerCase()
				);
			});

			if (!isTaskExistingInCard) {
				postTask(formContent).then((res) => {
					console.log(res);
				});

				allTasksHandler((oldTasks) => {
					return [...oldTasks, formContent];
				});

				formHandler((oldContents) => {
					return { ...oldContents, content: '', _id: uuidTaskId };
				});
			}

			// Insert error code in else
		}
	};

	const deleteTaskHandler = async (id) => {
		allTasksHandler((oldContent) => {
			const newTasks = oldContent.filter((task) => task._id !== id);
			return newTasks;
		});
		await deleteTask(id).then((res) => {
			console.log(res);
		});
	};

	const taskPriorityHandler = async (id) => {
		allTasksHandler((oldContent) => {
			const newTasks = oldContent.map((task) => {
				if (task._id === id) {
					let editedValue = { ...task, isPriority: !task.isPriority };
					return editedValue;
				}
				return task;
			});
			return newTasks;
		});

		let editingTask = allTasks.find((task) => task._id === id);

		await editTaskIsPriority(
			{
				isPriority: !editingTask.isPriority,
			},
			id
		).then((res) => {
			console.log(res);
		});
	};

	const taskCompletionHandler = async (id) => {
		allTasksHandler((oldContent) => {
			const newTasks = oldContent.map((task) => {
				if (task._id === id) {
					let editedValue = { ...task, isCompleted: !task.isCompleted };
					return editedValue;
				}
				return task;
			});
			return newTasks;
		});

		let editingTask = allTasks.find((task) => task._id === id);

		await editTaskIsCompleted(
			{
				isCompleted: !editingTask.isCompleted,
			},
			id
		).then((res) => {
			console.log(res);
		});
	};

	const taskContentEditHandler = async (content, id) => {
		const isTaskExistingInCard = allTasks.some((task) => {
			return (
				task.content.toString().toLowerCase() ===
				content.toString().toLowerCase()
			);
		});

		if (!isTaskExistingInCard) {
			allTasksHandler((oldContent) => {
				const newTasks = oldContent.map((task) => {
					if (task._id === id) {
						let editedValue = { ...task, content };
						return editedValue;
					}
					return task;
				});
				return newTasks;
			});

			await editTaskContent(
				{
					content,
				},
				id
			).then((res) => {
				console.log(res);
			});
		}
	};

	// Consider putting all task action handlers here so as to make the task container aa pure component
	useEffect(() => {
		return () => {
			_isMounted.current = false;
		};
	}, []);

	// Add a conditional to only be rendered if the card date of deadline is there
	// if (currentTasks.length >= 1) {

	if (!isLoading) {
		return (
			<div
				className="card-container"
				onMouseLeave={() => isCardMenuOpenHandler(false)}
			>
				<div className="card-info-container">
					<div className="card-info-date-container">
						<p className={isToday ? 'is-card-today' : undefined}>
							{dateOfDeadline && dateFormatter(dateOfDeadline).dayOfWeek}
						</p>
						<p className={isToday ? 'is-card-today' : undefined}>
							{dateOfDeadline && dateFormatter(dateOfDeadline).displayDate}
						</p>
						<p>{isToday && 'Today'}</p>
					</div>
					<div
						className="card-info-options-container"
						onClick={() => isCardMenuOpenHandler((e) => !e)}
					>
						<span
							className="iconify"
							data-icon="carbon:overflow-menu-horizontal"
							data-inline="false"
							title="Card Menu"
						></span>
					</div>
					{isCardMenuOpen && (
						<div
							className="card-menu-container"
							onMouseLeave={() => isCardMenuOpenHandler(false)}
						>
							<div
								className="delete-card-container"
								onClick={() => {
									if (
										window.confirm(
											'Are you sure you want to delete this card all the tasks in it?'
										)
									) {
										deleteCardHandler(_id);
									}
								}}
							>
								<span
									className="iconify"
									data-icon="fluent:delete-16-regular"
									data-inline="false"
									title="Delete Card"
								></span>
								<p>Delete Card</p>
							</div>
							<div className="edit-card-container">
								<span
									class="iconify"
									data-icon="feather:edit"
									data-inline="false"
									title="Edit Card"
								></span>
								<p>Edit Card</p>
							</div>
							<div className="milestone-card-container">
								<span
									class="iconify"
									data-icon="octicon:milestone-16"
									data-inline="false"
								></span>
								<p>Mark Milestone</p>
							</div>
						</div>
					)}
				</div>

				<form className="card-addtask-form-container" onSubmit={submitHandler}>
					<input
						type="text"
						maxLength="90"
						spellCheck="false"
						required
						value={formContent.content}
						onChange={(e) => {
							formHandler((oldContents) => {
								return { ...oldContents, content: e.target.value };
							});
						}}
					/>
					<button type="submit" className="add-task-button">
						<span
							className="iconify"
							data-icon="fluent:add-12-filled"
							data-inline="false"
							title="Add New Task"
						></span>
					</button>
				</form>
				<div className="card-taskslist-container">
					{currentTasks.priorityTasks &&
						currentTasks.priorityTasks.map((task) => {
							return (
								<TaskContainer
									{...task}
									key={task._id}
									deleteTaskHandler={() => deleteTaskHandler(task._id)}
									taskPriorityHandler={() => taskPriorityHandler(task._id)}
									taskCompletionHandler={() => taskCompletionHandler(task._id)}
									taskContentEditHandler={taskContentEditHandler}
									isToday={isToday}
									allTasks={allTasks}
								/>
							);
						})}
					{currentTasks.normalTasks &&
						currentTasks.normalTasks.map((task) => {
							return (
								<TaskContainer
									{...task}
									key={task._id}
									deleteTaskHandler={() => deleteTaskHandler(task._id)}
									taskPriorityHandler={() => taskPriorityHandler(task._id)}
									taskCompletionHandler={() => taskCompletionHandler(task._id)}
									taskContentEditHandler={taskContentEditHandler}
									isToday={isToday}
									allTasks={allTasks}
								/>
							);
						})}
					{currentTasks.completedPriority &&
						currentTasks.completedPriority.map((task) => {
							return (
								<TaskContainer
									{...task}
									key={task._id}
									deleteTaskHandler={() => deleteTaskHandler(task._id)}
									taskPriorityHandler={() => taskPriorityHandler(task._id)}
									taskCompletionHandler={() => taskCompletionHandler(task._id)}
									taskContentEditHandler={taskContentEditHandler}
									isToday={isToday}
									allTasks={allTasks}
								/>
							);
						})}
					{currentTasks.completedTasks &&
						currentTasks.completedTasks.map((task) => {
							return (
								<TaskContainer
									{...task}
									key={task._id}
									deleteTaskHandler={() => deleteTaskHandler(task._id)}
									taskPriorityHandler={() => taskPriorityHandler(task._id)}
									taskCompletionHandler={() => taskCompletionHandler(task._id)}
									taskContentEditHandler={taskContentEditHandler}
									isToday={isToday}
									allTasks={allTasks}
								/>
							);
						})}
				</div>
			</div>
		);
	}

	return <></>;
};

export default CardContainer;
