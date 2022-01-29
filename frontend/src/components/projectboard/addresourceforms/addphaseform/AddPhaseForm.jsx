import React, { useState, useEffect, useRef } from 'react';
import { postPhase } from '../../../../middleware/phaseRouteRequests';

import { v4 as uuidv4 } from 'uuid';

const AddPhaseForm = ({ isFormOpen, phaseList, phaseListHandler }) => {
	const _isMounted = useRef(true);

	const [remainingPhaseOrderList, remainingPhaseOrderListHandler] = useState(
		[]
	);
	const [formContent, formHandler] = useState({
		phaseName: '',
		phaseOrder: 0,
		_id: uuidv4(),
	});

	const submitHandler = async (e) => {
		if (_isMounted) {
			e.preventDefault();

			formHandler((oldContents) => {
				return { ...oldContents, _id: uuidv4() };
			});

			let isPhaseExisting = phaseList.filter((phase) => {
				if (
					phase.phaseName.toLowerCase() === formContent.phaseName.toLowerCase()
				) {
					return phase;
				}
				return null;
			})[0];

			if (!isPhaseExisting) {
				phaseListHandler((e) => {
					let newList = [...e, formContent];

					let orderedList = newList.sort((a, b) => {
						return a.phaseOrder - b.phaseOrder;
					});

					return orderedList;
				});

				postPhase(formContent).then((res) => {
					console.log(res);
					remainingPhaseOrderListHandler((e) =>
						e.filter((num) => num !== formContent.phaseOrder)
					);
				});
			}

			formHandler({
				phaseName: '',
				phaseOrder: 0,
				_id: uuidv4(),
			});
		}
	};

	useEffect(() => {
		if (_isMounted && phaseList) {
			const totalList = [1, 2, 3, 4, 5, 6, 7, 8];
			const existingOrderList = phaseList.map((phase) => phase.phaseOrder);
			const remainingOrderList = totalList.filter(
				(val) => !existingOrderList.includes(val)
			);

			if (remainingOrderList.length >= 1) {
				remainingPhaseOrderListHandler(remainingOrderList);
			}
		}
	}, [phaseList]);

	useEffect(() => {
		return () => {
			_isMounted.current = false;
		};
	}, []);

	return (
		<div
			className={
				isFormOpen
					? 'add-phase-form-container add-phase-big'
					: 'add-phase-form-container sidebar-hide'
			}
		>
			<div className="add-phase-header-container">
				<p>Phase Manager</p>
				<p>Add a new phase today</p>
			</div>
			{remainingPhaseOrderList.length >= 1 && (
				<form className="add-phase-form" onSubmit={submitHandler}>
					<div className="add-phase-input-container">
						<label htmlFor="phaseName">Phase Name</label>
						<input
							type="text"
							required
							name="phaseName"
							id="phaseName"
							onChange={(e) => {
								formHandler((p) => {
									return { ...p, phaseName: e.target.value };
								});
							}}
							value={formContent.phaseName}
						/>
					</div>

					<div className="add-phase-input-container">
						<label htmlFor="phaseOrder">Phase Order</label>
						<select
							name="phaseOrder"
							id="phaseOrder"
							onChange={(e) => {
								formHandler((p) => {
									return { ...p, phaseOrder: parseInt(e.target.value) };
								});
							}}
							value={formContent.phaseOrder}
							required
						>
							<option
								value="0"
								placeholder="Select phase order"
								defaultValue
							></option>
							{remainingPhaseOrderList.map((order) => {
								return (
									<option type="number" value={order} key={order}>
										{order}
									</option>
								);
							})}
						</select>
					</div>

					<button type="submit" className="add-phase-btn-container">
						Add New Project
					</button>
				</form>
			)}
		</div>
	);
};

export default AddPhaseForm;

/*

*/
