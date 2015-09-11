'use strict';

angular.module('workspaceApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/polls/new', {
        templateUrl: 'app/polls/new/new.html',
        controller: 'PollsNewCtrl',
        authenticate: true
      });
  });
