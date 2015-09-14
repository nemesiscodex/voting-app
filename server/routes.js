/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var Poll = require('./api/poll/poll.model');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/polls', require('./api/poll'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      var userAgent =  req.headers['user-agent'];
      var reUserAgent = new RegExp(/(facebookexternalhit|Twitterbot|Pinterest|Google).*/);
      var rePollPath = new RegExp(/\/polls\/([0-9a-z]+)\/?/);
      var checkUserAgent = reUserAgent.exec(userAgent);
      var checkPath = rePollPath.exec(req.path);
      if(checkPath !== null && checkUserAgent !== null && checkUserAgent.length > 1 && checkPath.length > 1){
        Poll.findById(checkPath[1])
          .populate('creator', 'name')
          .exec(function (err, poll) {
            if(err) { return handleError(res, err); }
            if(!poll) { return res.status(404).send('Not Found'); }
            var openGrapthInfo = '<!doctype html>' +
              '<html><head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# pollvot: http://ogp.me/ns/fb/pollvot#">' +
              '<meta charset="utf-8">' +
              '<meta property="fb:app_id" content="682746471855920" />' +
              '<meta property="og:type"   content="pollvot:poll" />' +
              '<meta property="fb:profile_id"   content="JulioDReyes" />' +
              '<meta property="og:url"    content="http://pollvot.herokuapp.com' + req.path + '" />' +
              '<meta property="og:title"  content="' + poll.name + '" />' +
              '<meta property="og:description"  content="Powered by PollVot" />' +
              '<meta property="og:see_also"  content="http://pollvot.herokuapp.com/" />' +
              '<meta property="og:image"  content="https://cloud.githubusercontent.com/assets/3976562/9844185/2aacc452-5a8f-11e5-882a-675949557537.png" />' +
              '</head></html>';

            return res.send(openGrapthInfo);
          });
      }else{
        res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
      }
    });
};
