const BotModel = require('../schemas/botSchema.js');
const mongoose = require('mongoose');

const createBot = async () => {
	const bot = new BotModel({
		_id: new mongoose.Types.ObjectId(),
		manutation: {
			enabled: false,
			reason: null,
			user: null,
		},
		versionLogs: {
			version: null,
			logs: null,
			enabled: false,
		},
		blacklist: {
			users: [],
			guilds: [],
			enabled: false,
		},
		commands: {
			enabled: false,
			commands: [],
		},
	});
	await bot.save();
};

const checkBot = async () => {
	const bot = await BotModel.findOne();
	if (!bot) {
		console.log('[DATABASE] Bot não encontrado, criando...'.yellow);
		await createBot();
		const bot2 = await getBot();
		return bot2;
	}
	console.log('[DATABASE] Bot encontrado!'.green);
	return bot;
};

const getBot = async () => {
	const bot = await BotModel.findOne();
	return bot;
};

const updateBot = async (data) => {
	await BotModel.findOneAndUpdate({}, data);
};

const editManutation = async (enabled, reason, user) => {
	await BotModel.findOneAndUpdate({}, { manutation: { enabled, reason, user } });
};

const editVersionLogs = async (version, logs, enabled) => {
	await BotModel.findOneAndUpdate({}, { versionLogs: { version, logs, enabled } });
};

const addBlacklistUser = async (user, reason) => {
	const bot = await getBot();
	bot.blacklist.users.push({ user, reason });
	await bot.save();
};

const addBlacklistGuild = async (guild, reason) => {
	const bot = await getBot();
	bot.blacklist.guilds.push({ guild, reason });
	await bot.save();
};

const removeBlacklistUser = async (user) => {
	const bot = await getBot();
	bot.blacklist.users = bot.blacklist.users.filter((u) => u.user !== user);
	await bot.save();
};

const removeBlacklistGuild = async (guild) => {
	const bot = await getBot();
	bot.blacklist.guilds = bot.blacklist.guilds.filter((g) => g.guild !== guild);
	await bot.save();
};

const editBlacklist = async (enabled) => {
	await BotModel.findOneAndUpdate({}, { blacklist: { enabled } });
};

const addCommand = async (command) => {
	const bot = await getBot();
	bot.commands.commands.push(command);
	await bot.save();
};

const removeCommand = async (command) => {
	const bot = await getBot();
	bot.commands.commands = bot.commands.commands.filter((c) => c !== command);
	await bot.save();
};

const getManutation = async () => {
	const bot = await getBot();
	return bot.manutation;
};

const getVersionLogs = async () => {
	const bot = await getBot();
	return bot.versionLogs;
};

const getBlacklist = async () => {
	const bot = await getBot();
	return bot.blacklist;
};

const getCommands = async () => {
	const bot = await getBot();
	return bot.commands;
};

module.exports = {
	checkBot,
	getBot,
	updateBot,
	editManutation,
	editVersionLogs,
	addBlacklistUser,
	addBlacklistGuild,
	removeBlacklistUser,
	removeBlacklistGuild,
	editBlacklist,
	addCommand,
	removeCommand,
	getManutation,
	getVersionLogs,
	getBlacklist,
	getCommands,
};