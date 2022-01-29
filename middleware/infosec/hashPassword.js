const bcrypt = require('bcryptjs');

async function hashPassword(password) {
	let hp = await bcrypt.hash(password, 8);

	return hp;
}
console.log(hashPassword('hello'));
module.exports = hashPassword;
