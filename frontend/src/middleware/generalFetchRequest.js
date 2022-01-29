// let headers = new Headers();
// headers.append('Content-Type', 'application/json');
// headers.append('Accept', 'application/json');
export async function getRequest(route) {
	try {
		const response = await fetch(`http://localhost:5000${route}`, {
			method: 'GET',
			mode: 'cors',
			redirect: 'follow',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			credentials: 'include',
		});
		const data = await response.json();
		console.log(data);
		return await data;
	} catch (error) {
		return { error };
	}
}

export async function postRequest(content, route) {
	try {
		const response = await fetch(`http://localhost:5000${route}`, {
			method: 'POST',
			mode: 'cors',
			redirect: 'follow',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify(await content),
		});
		const data = await response.json();
		return await data;
	} catch (error) {
		return { error };
	}
}

export async function patchRequest(content, route) {
	try {
		const response = await fetch(`http://localhost:5000${route}`, {
			method: 'PATCH',
			mode: 'cors',
			redirect: 'follow',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify(await content),
		});
		const data = await response.json();
		return await data;
	} catch (error) {
		return { error };
	}
}

export async function deleteRequest(route) {
	try {
		const response = await fetch(`http://localhost:5000${route}`, {
			method: 'DELETE',
			mode: 'cors',
			redirect: 'follow',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
		const data = await response.json();
		return await data;
	} catch (error) {
		return { error };
	}
}

// /auth/signup
