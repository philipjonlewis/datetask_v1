import { getRequest, postRequest } from './generalFetchRequest';

export async function verifyUser() {
	const data = await getRequest('/auth/verifyuser');
	return data;
}

export async function logInRouteRequest(content) {
	const data = await postRequest(content, '/auth/login');
	return data;
}

export async function signUpRouteRequest(content) {
	const data = await postRequest(content, '/auth/signup');
	return data;
}
