exports.getResourceSuccess = async (res, payload) => {
	return await res.status(200).json({
		status: true,
		response: 'Showing resource',
		...(payload && { payloadCount: payload.length, payload }),
	});
};

exports.postResourceSuccess = async (res, payload) => {
	return await res.status(201).json({
		status: true,
		response: 'Created resource',
		...(payload && { payloadCount: [payload].length, payload }),
	});
};

exports.patchResourceSuccess = async (res, payload) => {
	return await res.status(200).json({
		status: true,
		response: 'Edited resource',
		...(payload && { payloadCount: [payload].length, payload }),
	});
};

exports.deleteResourceSuccess = async (res) => {
	return await res.status(200).json({
		status: true,
		response: 'Deleted resource',
	});
};

// POST = 200
// GET = 201
exports.resourceSuccessResponseWithCookie = async (
	res,
	status,
	payload,
	route
) => {
	await res
		.status(status)
		.cookie(`datask-current${route}`, payload._id, {
			secure: false, //Marks the cookie to be used with HTTPS only.
			signed: true,
			httpOnly: false,
			path: '/',
			expires: new Date(Date.now() + 1209600000),
		})
		.json({
			status: true,
			response: 'Showing resource',
			...(payload && { payloadCount: [payload].length, payload }),
		});
};
