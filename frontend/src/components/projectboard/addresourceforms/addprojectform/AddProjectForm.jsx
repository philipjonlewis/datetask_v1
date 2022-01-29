import React, { useState, useEffect, useRef } from 'react';
import { postProject } from '../../../../middleware/projectRouteRequests';

const AddProjectForm = ({
	projectsUpdateTriggerHandler,
	isAddProjectFormOpen,
}) => {
	const _isMounted = useRef(true);

	let start = new Date();
	start.setHours(8, 0, 0, 0);
	const today = start.toISOString().split('T')[0];

	const [formError, formErrorHandler] = useState('');

	const [formContent, formHandler] = useState({
		projectName: '',
		projectDescription: '',
		dateOfDeadline: '',
		natureOfProject: '',
		projectImage: '',
	});

	const changeHandler = (e) => {
		formHandler((p) => {
			return { ...p, [e.target.name]: e.target.value };
		});
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		
		formHandler((form) => {
			let newDeadline = new Date(form.dateOfDeadline);
			newDeadline.setHours(8, 0, 0, 0);

			return { ...form, dateOfDeadline: newDeadline };
		} );
		
		if (_isMounted) {
			postProject(formContent)
				.then((res) => {
					if (res.status) {
						formHandler({
							projectName: '',
							projectDescription: '',
							dateOfDeadline: '',
							natureOfProject: '',
							projectImage: '',
						});
					} else {
						formErrorHandler('Project Already Exists');

						setTimeout(() => {
							formErrorHandler(false);
						}, 3000);
					}
				})
				.then(() => {
					projectsUpdateTriggerHandler(true);
				});
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
				isAddProjectFormOpen
					? 'add-project-form-container add-project-big'
					: 'add-project-form-container sidebar-hide'
			}
		>
			<div className="add-project-header-container">
				<p>Add New Project</p>
				<p>Add a new project today</p>
			</div>
			{formError && <p>{formError}</p>}
			<form className="add-project-form" onSubmit={submitHandler}>
				<div className="add-project-input-container">
					<label htmlFor="projectName">Project Name</label>
					<input
						type="text"
						required
						name="projectName"
						id="projectName"
						value={formContent.projectName}
						onChange={(e) => {
							changeHandler(e);
						}}
					/>
				</div>
				<div className="add-project-input-container">
					<label htmlFor="projectDescription">Project Description</label>
					<input
						type="text"
						required
						name="projectDescription"
						id="projectDescription"
						value={formContent.projectDescription}
						onChange={(e) => {
							changeHandler(e);
						}}
					/>
				</div>
				<div className="add-project-input-container">
					<label htmlFor="dateOfDeadline">Intended Date of Completion</label>
					<input
						type="date"
						min={today}
						required
						name="dateOfDeadline"
						id="dateOfDeadline"
						onChange={(e) => {
							changeHandler(e);
						}}
						value={formContent.dateOfDeadline}
					/>
				</div>
				<div className="add-project-input-container">
					<label htmlFor="natureOfProject">Nature of Project</label>
					<input
						type="text"
						required
						name="natureOfProject"
						id="natureOfProject"
						value={formContent.natureOfProject}
						onChange={changeHandler}
					/>
				</div>
				<div className="add-project-input-container">
					<label htmlFor="projectImage">Project Image</label>
					<input
						type="text"
						required
						name="projectImage"
						id="projectImage"
						value={formContent.projectImage}
						onChange={changeHandler}
					/>
				</div>
				<button type="submit" className="add-project-btn-container">
					Add New Project
				</button>
			</form>
		</div>
	);

	// return (
	// 	<div className="form-container">
	// 		<form onSubmit={submitHandler}>
	// 			{formError.length >= 1 && (
	// 				<div className="submission-error">
	// 					<span
	// 						className="iconify"
	// 						data-icon="feather:alert-triangle"
	// 						data-inline="false"
	// 					></span>
	// 					<p>{formError}</p>
	// 				</div>
	// 			)}
	// 			<div className="title">
	// 				<h1>Create a new project</h1>
	// 			</div>
	// 			<div>
	// 				<label htmlFor="projectName">Project Name</label>
	// 				<input
	// 					type="text"
	// 					name="projectName"
	// 					id="projectName"
	// 					required
	// 					value={formContent.projectName}
	// 					onChange={(e) => changeHandler(e)}
	// 				/>
	// 			</div>
	// 			<div>
	// 				<label htmlFor="projectDescription">Project Description</label>
	// 				<input
	// 					type="text"
	// 					name="projectDescription"
	// 					id="projectDescription"
	// 					required
	// 					value={formContent.projectDescription}
	// 					onChange={(e) => changeHandler(e)}
	// 				/>
	// 			</div>
	// 			<div>
	// 				<label htmlFor="natureOfProject">Nature of Project</label>
	// 				<input
	// 					type="text"
	// 					name="natureOfProject"
	// 					id="natureOfProject"
	// 					required
	// 					value={formContent.natureOfProject}
	// 					onChange={(e) => changeHandler(e)}
	// 				/>
	// 			</div>
	// 			<div>
	// 				<label htmlFor="projectImage">Project Image</label>
	// 				<input
	// 					type="text"
	// 					name="projectImage"
	// 					id="projectImage"
	// 					required
	// 					value={formContent.projectImage}
	// 					onChange={(e) => changeHandler(e)}
	// 				/>
	// 			</div>
	// 			<div className="submit-button-container">
	// 				<button type="submit" className="submit-button">
	// 					Add Project
	// 				</button>
	// 			</div>
	// 		</form>
	// 	</div>
	// );
};

export default AddProjectForm;
