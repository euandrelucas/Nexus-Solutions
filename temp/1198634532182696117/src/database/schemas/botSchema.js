const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const botSchema = new Schema({
	_id: ObjectId,
	manutation: {
		enabled: Boolean,
		reason: String,
		user: String,
	},
	versionLogs: {
		version: String,
		logs: String,
		enabled: Boolean,
	},
	blacklist: {
		users: Array,
		guilds: Array,
		enabled: Boolean,
	},
	commands: {
		enabled: Boolean,
		commands: Array,
	},
});

module.exports = mongoose.model('Bot', botSchema);