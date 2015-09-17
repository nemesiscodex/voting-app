'use strict';

var _ = require('lodash');
var Poll = require('./poll.model');

// Get list of all polls
exports.index = function(req, res) {
  Poll.find().populate('creator', 'name').exec(function (err, polls) {
    if(err) { return handleError(res, err); }
    polls = polls.map(function(poll){
      poll.totalVotes = poll.items.reduce(function(sum, item){ return sum + item.votes; }, 0);
      poll.items = poll.items.sort(function(itemA, itemB){
        return itemB.votes - itemA.votes;
      });
      return poll;
    }).sort(function(pollA, pollB){
      return pollB.totalVotes - pollA.totalVotes;
    });
    return res.status(200).json(polls);
  });
};

// Get list of my polls
exports.indexMine = function(req, res) {
  var user = req.user;
  Poll.find({creator: user._id}).populate('creator', 'name').exec(function (err, polls) {
    if(err) { return handleError(res, err); }
    polls = polls.map(function(poll){
      poll.totalVotes = poll.items.reduce(function(sum, item){ return sum + item.votes; }, 0);
      poll.items = poll.items.sort(function(itemA, itemB){
        return itemB.votes - itemA.votes;
      });
      return poll;
    }).sort(function(pollA, pollB){
      return pollB.creationDate.getTime() - pollA.creationDate.getTime();
    });
    return res.status(200).json(polls);
  });
};

// Get a single poll
exports.show = function(req, res) {
  Poll.findById(req.params.id)
    .populate('creator', 'name')
    .exec(function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    return res.json(poll);
  });
};

// Creates a new poll in the DB.
exports.create = function(req, res) {
  var user = req.user;
  req.body.creator = user._id;
  req.body.creationDate = new Date();
  Poll.create(req.body, function(err, poll) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(poll);
  });
};

// Updates an existing poll in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Poll.findById(req.params.id, function (err, poll) {
    if (err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    var updated = _.extend(poll, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(poll);
    });
  });
};

// Vote
exports.vote = function(req, res){
  var user = req.user;
  Poll.update({_id: req.params.id,'items._id': req.body.itemId},
    {$inc: {'items.$.votes': 1}, $addToSet: {voters: user._id}})
    .exec(function (err){
      if(err) { return handleError(res, err); }
      Poll.findById(req.params.id).populate('creator', 'name').exec(function (err, poll) {
        if(err) { return handleError(res, err); }
        if(!poll) { return res.status(404).send('Not Found'); }
        return res.status(200).json(poll)
      });
    });
};

// Deletes a poll from the DB.
exports.destroy = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    poll.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
