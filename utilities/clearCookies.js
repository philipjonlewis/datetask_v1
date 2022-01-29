const { asyncHandler } = require('../middleware/asyncHandler');

const clearCookies = asyncHandler(async (res, item) => {
	if (item === 'Project') {
		await res.clearCookie(`datask-currentProject`, { path: '/' });
		await res.clearCookie(`datask-currentPhase`, { path: '/' });
	}
	if (item === 'Phase') {
		await res.clearCookie(`datask-currentPhase`, { path: '/' });
	}
});

module.exports = clearCookies;
