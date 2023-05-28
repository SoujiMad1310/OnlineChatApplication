//The below code imports the schema to index.js from models.js .
const mongoose = require('mongoose')

// Schema for ChatData
const ChatSchema = mongoose.Schema({
	Username: {
		type: String,
		required: false
	},
	message: {
		type: String,
		required: false
	}
})

//Creating the collection ChatData
const ChatData = mongoose.model('OnlineChat', ChatSchema)

module.exports = ChatData;