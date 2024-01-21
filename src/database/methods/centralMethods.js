const CentralModel = require('../schemas/centralSchema.js');
const mongoose = require('mongoose');

const createCentral = async (guildId) => {
	const central = new CentralModel({
		_id: new mongoose.Types.ObjectId(),
		guildId: guildId
	});
	await central.save();
	return central;
};

const checkCentral = async (guildId) => {
	const central = await getCentral(guildId);
	if (!central) {
		const central = await createCentral(guildId);
		return central;
	}
	return central;
};

const getCentral = async (guildId) => {
	const central = await CentralModel.findOne({ guildId: guildId });
	return central;
};

const addFreeBot = async (guildId) => {
	const central = await getCentral(guildId);
	if (!central) return false;
	central.freeBots++;
	await central.save();
	return true;
};

const removeFreeBot = async (guildId) => {
	const central = await getCentral(guildId);
	if (!central) return false;
	central.freeBots--;
	await central.save();
	return true;
};

const addPremiumBot = async (guildId) => {
	const central = await getCentral(guildId);
	if (!central) return false;
	central.premiumBots++;
	await central.save();
	return true;
};

const removePremiumBot = async (guildId) => {
	const central = await getCentral(guildId);
	if (!central) return false;
	central.premiumBots--;
	await central.save();
	return true;
};

const addPremiumUser = async (guildId, userID) => {
	const central = await getCentral(guildId);
	if (!central) return false;
	central.premiumUsers.push(userID);
	await central.save();
	return true;
};

const removePremiumUser = async (guildId, userID) => {
	const central = await getCentral(guildId);
	if (!central) return false;
	const user = central.premiumUsers.find(user => user === userID);
	if (!user) return false;
	central.premiumUsers.splice(central.premiumUsers.indexOf(user), 1);
	await central.save();
	return true;
};

module.exports = {
	checkCentral,
	createCentral,
	getCentral,
	addFreeBot,
	removeFreeBot,
	addPremiumBot,
	removePremiumBot,
	addPremiumUser,
	removePremiumUser
};