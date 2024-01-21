module.exports = {
	dev: ['717766639260532826'],
	supportServer: '',
	logs: {
		host: ''
	},
	client: {
		id: process.env.CLIENT_ID,
		secret: process.env.CLIENT_SECRET,
		token: process.env.CLIENT_TOKEN,
	},
	database: {
		uri: process.env.MONGO_URI,
	}
};