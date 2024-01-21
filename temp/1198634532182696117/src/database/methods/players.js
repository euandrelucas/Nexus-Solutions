const LavalinkModel = require('../schemas/lavalinkSchema.js');
const mongoose = require('mongoose');

const createPlayer = async (guildId, voiceChannelId, textChannelId, selfDeaf, tracks) => {
	const player = new LavalinkModel({
		_id: new mongoose.Types.ObjectId(),
		guildId: guildId,
		voiceChannelId: voiceChannelId,
		textChannelId: textChannelId,
		selfDeaf: selfDeaf,
		tracks: tracks,
	});
	await player.save();
};

const getPlayer = async (guildId) => {
	const player = await LavalinkModel.findOne({ guildId: guildId });
	return player;
};

const checkPlayer = async (guildId) => {
	const player = await LavalinkModel.findOne({ guildId: guildId });
	if (!player) {
		await createPlayer(guildId);
		const player2 = await getPlayer(guildId);
		return player2;
	}
	return player;
};

const updatePlayer = async (guildId, voiceChannelId, textChannelId, selfDeaf, tracks) => {
	await LavalinkModel.findOneAndUpdate({ guildId: guildId }, { voiceChannelId: voiceChannelId, textChannelId: textChannelId, selfDeaf: selfDeaf, tracks });
};

module.exports = {
	createPlayer,
	getPlayer,
	checkPlayer,
	updatePlayer,
};
