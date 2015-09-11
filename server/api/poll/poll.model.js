'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Item = new Schema({
	name: String,
	votes: Number
});

var PollSchema = new Schema({
  name: String,
  items: [Item],
	creationDate: Date,
	creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	voters: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Poll', PollSchema);