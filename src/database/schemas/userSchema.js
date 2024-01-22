const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
	_id: ObjectId,
	userID: String,
	blocked: {
		type: Boolean,
		default: false
	},
	hostBots: {
		type: Array,
		default: []
	},
	listBots: {
		type: Array,
		default: []
	},
	listServers: {
		type: Array,
		default: []
	},
	premium: {
		type: Boolean,
		time: Date,
		default: false
	},
});

module.exports = mongoose.model('User', userSchema);