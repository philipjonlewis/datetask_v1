const clearCookies = require('./clearCookies');

module.exports = async (res) => {
	await res.clearCookie(`datask-currentUser`, { path: '/' });
	await res.clearCookie(`datask-currentProject`, { path: '/' });
	await res.clearCookie(`datask-currentPhase`, { path: '/' });

	await res.header('Authorization', `Bearer `);
};
