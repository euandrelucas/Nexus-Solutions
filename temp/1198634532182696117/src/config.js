module.exports = {
	dev: ['742798447253651506', '717766639260532826'],
	transcriptServer: 'https://transcript.lyrabot.online',
	supportServer: '',
	client: {
		id: process.env.CLIENT_ID,
		secret: process.env.CLIENT_SECRET,
		token: process.env.CLIENT_TOKEN,
	},
	database: {
		uri: process.env.MONGO_URI,
	},
	devLogs: {
		guildJoin: '1194007487557419078',
		guildLeave: '1194007550002212934',
		commands: '1194007592863801444'
	},
	lavalink: {
		nodes: [
			{
				id: 'Sonora',
				hostname: 'localmachine',
				port: 2333,
				password: 'youshallnotpass',
				// transport: 'rest'
			},
			{
				id: 'Denky',
				hostname: '144.217.129.37',
				port: 2333,
				password: 'youshallnotpass',
				// transport: 'rest'
			}
		],
		spotify: {
			id: process.env.SPOTIFY_ID,
			secret: process.env.SPOTIFY_SECRET,
		}
	}
};