import React, { useState, useEffect, useRef } from 'react';

const TaskContainer = ({
	content,
	_id,
	deleteTaskHandler,
	isPriority,
	isCompleted,
	taskPriorityHandler,
	taskCompletionHandler,
	taskContentEditHandler,
	isToday,
	allTasks,
}) => {
	const _isMounted = useRef(true);

	const [isPriorityButton, isPriorityButtonHandler] = useState('');
	const [isPriorityContent, isPriorityContentHandler] = useState('');
	const [isEditing, isEditingHandler] = useState(false);
	const [taskContent, taskContentHandler] = useState(null);
	const [currentContent, currentContentHandler] = useState(null);

	useEffect(() => {
		if (_isMounted) {
			taskContentHandler(content);
			currentContentHandler(content);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		let priorityButton = '';
		let priorityContent = '';
		const isBool = typeof isPriority === 'boolean';

		if (isBool && isPriority) {
			if (isPriority && isToday) {
				priorityButton = 'is-priority-today-button';
				priorityContent = 'is-priority-today-content';
			}
			if (isPriority && !isToday) {
				priorityButton = 'is-priority-button';
				priorityContent = 'is-priority-content';
			}

			isPriorityButtonHandler(priorityButton);
			isPriorityContentHandler(priorityContent);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const submitHandler = async (e) => {
		e.preventDefault();

		const newTask = e.target[0].value;

		const isTaskExisting = allTasks.some((existingTask) => {
			return (
				existingTask.content.toString().toLowerCase() ===
				newTask.toString().toLowerCase()
			);
		});

		if (newTask.length >= 1 && !isTaskExisting) {
			await taskContentEditHandler(taskContent, _id);
			currentContentHandler(taskContent);
			isEditingHandler(false);
		}
	};

	const changeHandler = (e) => {
		taskContentHandler(e.target.value);
	};

	const onEnterPress = async (e) => {
		if (e.keyCode === 13) {
			e.preventDefault();

			const isTaskExisting = allTasks.some((existingTask) => {
				return (
					existingTask.content.toString().toLowerCase() ===
					e.target.value.toString().toLowerCase()
				);
			});

			if (e.target.value.length >= 1 && !isTaskExisting) {
				await taskContentEditHandler(taskContent, _id);
				currentContentHandler(taskContent);
				isEditingHandler(false);
			}
		}
	};

	useEffect(() => {
		return () => {
			_isMounted.current = false;
		};
	}, []);

	return (
		<div
			className={
				typeof isCompleted === 'boolean' && !isCompleted
					? 'task-container'
					: 'task-container is-completed-content'
			}
			onMouseLeave={() => {
				taskContentHandler(currentContent);
				isEditingHandler(false);
			}}
		>
			<div className="task-container-icons">
				<div
					onClick={taskCompletionHandler}
					className={isEditing ? 'hide-btn' : undefined}
				>
					{!isCompleted ? (
						<span
							className="iconify"
							data-icon="akar-icons:circle"
							data-inline="false"
							title="Mark As Complete"
						></span>
					) : (
						<span
							className="iconify"
							data-icon="akar-icons:circle-check"
							data-inline="false"
							title="Mark As Incomplete"
						></span>
					)}
				</div>
				<div
					className={isCompleted ? 'hide-btn' : undefined}
					onClick={() => isEditingHandler((e) => !e)}
				>
					<span
						className="iconify"
						data-icon="feather:edit"
						data-inline="false"
						title="Edit Task"
					></span>
				</div>
				<div
					onClick={taskPriorityHandler}
					className={
						isEditing || isCompleted
							? `${isPriorityButton} hide-btn`
							: isPriorityButton
					}
				>
					<span
						className="iconify"
						data-icon="akar-icons:flag"
						data-inline="false"
						title="Mark As Priority"
					></span>
				</div>
			</div>
			<div
				className={
					typeof isPriority === 'boolean' && !isPriority
						? 'task-container-content'
						: `task-container-content ${isPriorityContent}`
				}
			>
				{/* <p>{content}</p> */}
				<form onSubmit={submitHandler}>
					{taskContent && (
						<textarea
							disabled={!isEditing}
							className={isEditing ? 'is-editing' : undefined}
							type="text"
							maxLength="90"
							spellCheck="false"
							onChange={changeHandler}
							value={taskContent}
							onKeyDown={onEnterPress}
						/>
					)}
					{isEditing && (
						<button type="submit">
							<span
								className="iconify"
								data-icon="bi:check-all"
								data-inline="false"
							></span>
						</button>
					)}
				</form>
			</div>
			<div className="task-container-delete" onClick={deleteTaskHandler}>
				<span className="iconify" data-icon="cil:x" data-inline="false"></span>
			</div>
		</div>
	);
};

export default TaskContainer;
