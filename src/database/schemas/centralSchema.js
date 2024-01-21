const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const centralSchema = new Schema({
	_id: ObjectId,
	guildId: String,
	freeBotsLimit: {
		type: Number,
		default: 100
	},
	freeBots: {
		type: Number,
		default: 0
	},
	premiumBotsLimit: {
		type: Number,
		default: 100
	},
	premiumBots: {
		type: Number,
		default: 0
	},
	premiumUsers: {
		type: Array,
		default: []
	},
});

module.exports = mongoose.model('Central', centralSchema);