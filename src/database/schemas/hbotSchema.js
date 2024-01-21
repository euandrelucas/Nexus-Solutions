const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const hostbotSchema = new Schema({
	_id: ObjectId,
	userID: String,
	botID: String,
	language: String,
	ram: Number,
	cpu: Number
});

module.exports = mongoose.model('HostBot', hostbotSchema);