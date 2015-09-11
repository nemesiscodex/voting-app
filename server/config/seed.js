/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');

var Poll = require('../api/poll/poll.model');

Poll.find({}).remove();

User.find({}).remove();