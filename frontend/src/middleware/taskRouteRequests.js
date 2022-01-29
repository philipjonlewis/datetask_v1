import {
	getRequest,
	postRequest,
	deleteRequest,
	patchRequest,
} from './generalFetchRequest';

export async function getTask(_id) {
	const data = await getRequest(`/tasks/${_id}`);
	return await data;
}

export async function getTasks() {
	const data = await getRequest('/tasks');
	return await data;
}

export async function postTask(content) {
	const data = await postRequest(content, '/tasks');
	return data;
}

export async function editTaskIsPriority(content, id) {
	const data = await patchRequest(content, `/tasks/isPriority/${id}`);
	return data;
}

export async function editTaskIsCompleted(content, id) {
	const data = await patchRequest(content, `/tasks/isCompleted/${id}`);
	return data;
}

export async function editTaskContent(content, id) {
	const data = await patchRequest(content, `/tasks/content/${id}`);
	return data;
}

export async function deleteTask(id) {
	const data = await deleteRequest(`/tasks/${id}`);
	return data;
}
