const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const playerSchema = new Schema({
	_id: ObjectId,
	guildId: String,
	voiceChannelId: String,
	textChannelId: String,
	selfDeaf: Boolean,
	tracks: Array,
});

module.exports = mongoose.model('Player', playerSchema);