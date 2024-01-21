const BotModel = require('../schemas/hbotSchema.js');
const mongoose = require('mongoose');

const createBot = async (userID, botID, language, ram, cpu) => {
	const bot = new BotModel({
		_id: mongoose.Types.ObjectId(),
		userID: userID,
		botID: botID,
		language: language,
		ram: ram,
		cpu: cpu
	});
	await bot.save();
	return bot;
};

const getBot = async (userID, botID) => {
	const bot = await BotModel.findOne({ userID: userID, botID: botID });
	return bot;
};

const deleteBot = async (userID, botID) => {
	const bot = await getBot(userID, botID);
	if (!bot) return false;
	await bot.delete();
	return true;
};

module.exports = {
	getBot,
	createBot,
	deleteBot
};