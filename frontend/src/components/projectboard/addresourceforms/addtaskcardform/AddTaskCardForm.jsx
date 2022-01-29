import React, { useState, useEffect, useRef } from 'react';
import { postTask } from '../../../../middleware/taskRouteRequests';
import { postCard } from '../../../../middleware/cardRouteRequests';

import { v4 as uuidv4 } from 'uuid';

const AddTaskCardForm = ({
	isAddTaskCardFormOpen,
	cardListHandler,
	cardList,
	newTaskAndCardTriggerHandler,
}) => {
	const _isMounted = useRef(true);

	let start = new Date();
	start.setHours(8, 0, 0, 0);
	const today = start.toISOString().split('T')[0];

	const [formContent, formHandler] = useState({
		dateOfDeadline: today,
		isCompleted: false,
		isPriority: false,
		content: '',
		_id: uuidv4(),
	});

	const changeHandler = (e) => {
		formHandler((p) => {
			return { ...p, [e.target.name]: e.target.value };
		});
	};

	const submitHandler = (e) => {
		e.preventDefault();

		formHandler((form) => {
			let newDeadline = new Date(form.dateOfDeadline);
			newDeadline.setHours(8, 0, 0, 0);

			return { ...form, dateOfDeadline: newDeadline };
		});

		if (_isMounted) {
			formHandler((oldContents) => {
				return { ...oldContents, _id: uuidv4() };
			});

			let isCardExisting = cardList.filter((card) => {
				if (
					new Date(card.dateOfDeadline).getTime() ===
					new Date(formContent.dateOfDeadline).getTime()
				) {
					return card;
				}
				return null;
			})[0];

			if (isCardExisting) {
				// Add some code here that says kapag existing walang ganap
				return newTaskAndCardTriggerHandler(true);
			}

			if (!isCardExisting) {
				let newCard = {
					dateOfDeadline: formContent.dateOfDeadline,
					isMilestone: false,
					_id: uuidv4(),
				};

				formHandler((prevForm) => {
					return {
						...prevForm,
						dateOfDeadline: formContent.dateOfDeadline,
					};
				});

				setTimeout(() => {
					postCard(newCard).then((res) => {
						console.log(res);
						if (res.status) {
							postTask(formContent).then((res) => {
								console.log(res);
							});
						}
					});
				}, 2000);

				let otherCard = { ...newCard };

				otherCard.tasks = [];
				otherCard.tasks.push(formContent);

				cardListHandler((prevList) => {
					let newList = prevList;
					newList.push(otherCard);
					newList.sort((a, b) => {
						return new Date(a.dateOfDeadline) - new Date(b.dateOfDeadline);
					});
					return newList;
				});

				newTaskAndCardTriggerHandler(true);
			}

			formHandler({
				dateOfDeadline: today,
				isCompleted: false,
				isPriority: false,
				content: '',
				_id: uuidv4(),
			});
		}
	};

	useEffect(() => {
		formHandler({
			dateOfDeadline: today,
			isCompleted: false,
			isPriority: false,
			content: '',
			_id: uuidv4(),
		});
	}, []);

	useEffect(() => {
		return () => {
			_isMounted.current = false;
		};
	}, []);

	return (
		<div
			className={
				isAddTaskCardFormOpen
					? 'add-taskcard-form-container add-taskcard-big'
					: 'add-taskcard-form-container sidebar-hide'
			}
		>
			<div className="add-taskcard-header-container">
				<p>Add New Task</p>
				<p>Add a new task today</p>
			</div>

			<form className="add-taskcard-form" onSubmit={submitHandler}>
				<div className="add-taskcard-input-container">
					<label htmlFor="content">Task Content</label>
					<input
						type="text"
						required
						name="content"
						id="content"
						onChange={changeHandler}
						value={formContent.content}
					/>
				</div>
				<div className="add-taskcard-input-container">
					<label htmlFor="dateOfDeadline">Date Of Deadline</label>
					<input
						type="date"
						min={today}
						required
						name="dateOfDeadline"
						id="dateOfDeadline"
						onChange={changeHandler}
						value={formContent.dateOfDeadline}
					/>
				</div>

				<button type="submit" className="add-taskcard-btn-container">
					Add New Task
				</button>
			</form>
		</div>
	);
};

export default AddTaskCardForm;
