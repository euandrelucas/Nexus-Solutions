require('colors');
require('dotenv').config();
const fs = require('fs/promises');
const path = require('path');
const mongoose = require('mongoose');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const config = require('./config.js');

const client = new Client({
	allowedMentions: {
		parse: ['users', 'roles'],
		repliedUser: true
	},
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages
	],
});

client.commands = new Collection();
client.db = require('./database/db.js');
client.emoji = require('./modules/emojis.json');

const loadCommands = async () => {
	const foldersPath = path.join(__dirname, 'commands');
	const commandFolders = await fs.readdir(foldersPath);

	await Promise.all(
		commandFolders.map(async (folder) => {
			const commandsPath = path.join(foldersPath, folder);
			const commandFiles = await fs.readdir(commandsPath);

			await Promise.all(
				commandFiles
					.filter((file) => file.endsWith('.js'))
					.map(async (file) => {
						const filePath = path.join(commandsPath, file);
						const command = require(filePath);
						if ('data' in command && 'execute' in command) {
							client.commands.set(command.data.name, command);
						}
						else {
							console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`.red);
						}
					})
			);
		})
	);
};

const loadEvents = async () => {
	const eventsPath = path.join(__dirname, 'events');
	const eventFiles = await fs.readdir(eventsPath);

	await Promise.all(
		eventFiles
			.filter((file) => file.endsWith('.js'))
			.map(async (file) => {
				const filePath = path.join(eventsPath, file);
				const event = require(filePath);
				if (event.once) {
					client.once(event.name, event.execute);
				}
				else {
					client.on(event.name, event.execute);
				}
			})
	);
};

process.on('unhandledRejection', (err) => console.log(`${err}`.red));
process.on('uncaughtException', (err) => console.log(`${err}`.red));
client.on('error', (err) => console.log(`${err}`.red));

const startBot = async () => {
	try {
		await mongoose.connect(config.database.uri);
		console.log('[DATABASE] Database Ready!'.green);
		await loadCommands();
		await loadEvents();
		require('./deployCommands.js');
		await client.login(config.client.token);
	}
	catch (error) {
		console.error(`[ERROR] An error occurred: ${error.message}`.red);
		process.exit(1);
	}
};

startBot();