module.exports = {
	dev: ['717766639260532826'],
	supportServer: '',
	logs: {
		host: '1198648041624838256',
		freeBots: '1198673534550032484'
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