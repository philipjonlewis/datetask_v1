import React, { useEffect, useRef } from 'react';

import { deleteTask } from '../../../middleware/taskRouteRequests';

const LapsedList = ({ taskListHandler, task }) => {
	const _isMounted = useRef(true);

	const deleteHandler = (task) => {
		if (_isMounted) {
			taskListHandler((prevList) => {
				const newList = prevList.filter((oldTask) => oldTask._id !== task._id);
				return newList;
			});
			setTimeout(() => {
				deleteTask(task._id).then((res) => {
					console.log(res);
				});
			}, 1000);
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
				task.isPriority
					? 'lapsed-proper is-priority-lapsed-content'
					: 'lapsed-proper is-normal-lapsed-content'
			}
		>
			<div className="lapsed-content-container">
				<div className="content">
					<p>{task.content}</p>
				</div>
				<div className="menu">
					<div className="resched-lapsed">
						<span
							className="iconify"
							data-icon="bx:bx-calendar-edit"
							data-inline="false"
							title="reschedule task"
						></span>
					</div>
					<div
						className="delete-lapsed"
						onClick={() => {
							deleteHandler(task);
						}}
					>
						<span
							className="iconify"
							data-icon="cil:x"
							data-inline="false"
							title="delete task"
						></span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LapsedList;
