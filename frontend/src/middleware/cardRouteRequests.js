import { getRequest, postRequest, deleteRequest } from './generalFetchRequest';

export async function getCard(_id) {
	const data = await getRequest(`/cards/${_id}`);
	return await data;
}

export async function getCards() {
	const data = await getRequest('/cards');
	return await data;
}

export async function getLapsedCards() {
	const data = await getRequest('/cards/lapsed');
	return await data;
}

export async function postCard(content) {
	const data = await postRequest(content, '/cards');
	return data;
}

export async function deleteCard(_id) {
	const data = await deleteRequest(`/cards/${_id}`);
	return await data;
}
