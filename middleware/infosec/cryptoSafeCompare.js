const crypto = require('crypto');

const safeCompare = (firstVal, secondVal) => {
	try {
		crypto.timingSafeEqual(
			Buffer.from(firstVal, 'utf-8'),
			Buffer.from(secondVal, 'utf-8')
		);
		return true;
	} catch (error) {
		return false;
	}
};

module.exports = safeCompare;
