'use strict';

angular.module('workspaceApp')
  .config(function ($routeProvider) {
    $routeProvider
	    .when('/polls', {
		    templateUrl: 'app/polls/polls.html',
		    controller: 'PollsCtrl'
	    })
			.when('/polls/mine', {
				templateUrl: 'app/polls/polls.html',
				controller: 'PollsCtrl'
			})
	    .when('/polls/:id', {
		    templateUrl: 'app/polls/poll.html',
		    controller: 'PollsCtrl',
		    reloadOnSearch: false
	    });
  });
