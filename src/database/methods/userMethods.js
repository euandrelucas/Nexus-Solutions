const UserModel = require('../schemas/userSchema.js');
const mongoose = require('mongoose');

const createUser = async (userID) => {
	const user = new UserModel({
		_id: new mongoose.Types.ObjectId(),
		userID: userID
	});
	await user.save();
	return user;
};

const getUser = async (userID) => {
	const user = await UserModel.findOne({ userID: userID });
	return user;
};

const addBot = async (userID, botID, language, ram, cpu) => {
	const user = await getUser(userID);
	if (!user) return false;
	const bot = {
		botID: botID,
		language: language,
		ram: ram,
		cpu: cpu
	};
	user.hostBots.push(bot);
	await user.save();
	return true;
};

const removeBot = async (userID, botID) => {
	const user = await getUser(userID);
	if (!user) return false;
	const bot = user.hostBots.find(bot => bot.botID === botID);
	if (!bot) return false;
	user.hostBots.splice(user.hostBots.indexOf(bot), 1);
	await user.save();
	return true;
};

module.exports = {
	createUser,
	getUser,
	addBot,
	removeBot
};