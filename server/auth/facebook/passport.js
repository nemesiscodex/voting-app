var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

exports.setup = function (User, config) {
	passport.use(new FacebookStrategy({
			clientID: config.facebook.clientID,
			clientSecret: config.facebook.clientSecret,
			callbackURL: config.facebook.callbackURL,
			profileFields: [
				'displayName',
				'emails'
			],
			scope: ['email']
		},
		function(accessToken, refreshToken, profile, done) {
			User.findOne({
					'facebook.id': profile.id
				},
				function(err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						console.log('profile', profile);
						user = new User({
							name: profile.displayName,
							role: 'user',
							provider: 'facebook',
							facebook: profile._json
						});
						if(profile.emails && profile.emails.length > 0){
							user.email = profile.emails[0].value;
						}
						user.save(function(err) {
							if (err) return done(err);
							done(err, user);
						});
					} else {
						return done(err, user);
					}
				})
		}
	));
};