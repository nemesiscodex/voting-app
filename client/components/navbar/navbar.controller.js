'use strict';

angular.module('workspaceApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': '<i class="home icon show-mobile-only"></i><span class="hide-mobile">PollVot</span>',
      'link': '/'
    },{
      'title': '<i class="line chart icon"></i> <span class="hide-mobile">Trending</span>',
      'link': '/polls'
    },{
      'needAuth': true,
      'title': '<i class="pie chart icon"></i> <span class="hide-mobile">My Polls</span>',
      'link': '/polls/mine'
    },{
      'needAuth': true,
      'title': '<i class="plus icon"></i> <span class="hide-mobile">New Poll</span>',
      'link': '/polls/new'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });