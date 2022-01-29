const mongoose = require('mongoose');

dbConnect = async () => {
	try {
		await mongoose.connect('mongodb://localhost:27017/localDataskDatabase', {
			useNewUrlParser: true,
			useFindAndModify: false,
			useCreateIndex: true,
			useUnifiedTopology: true,
		});
		console.log('Connected to the database');
	} catch (error) {
		console.error(error);
	}
};

module.exports = dbConnect;
