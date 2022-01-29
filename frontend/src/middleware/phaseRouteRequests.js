import { getRequest, postRequest } from './generalFetchRequest';

export async function getPhase(_id) {
	const data = await getRequest(`/phases/${_id}`);
	return await data;
}

export async function getPhases() {
	const data = await getRequest('/phases');
	return await data;
}

export async function postPhase(content) {
	const data = await postRequest(content, '/phases');
	return data;
}
