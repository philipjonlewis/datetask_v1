import { getRequest, postRequest, deleteRequest } from './generalFetchRequest';

export async function getProject(_id) {
	const data = await getRequest(`/projects/${_id}`);
	return await data;
}

export async function getCurrentProject() {
	const data = await getRequest(`/projects/current`);
	return await data;
}

export async function getProjects() {
	const data = await getRequest('/projects');
	return await data;
}

export async function getProjectData() {
	const data = await getRequest('/projects/infoboard/projectdata');
	return await data;
}

export async function postProject(content) {
	const data = await postRequest(content, '/projects');
	return data;
}

export async function deleteProject(id) {
	const data = await deleteRequest(`/projects/${id}`);
	return data;
}
