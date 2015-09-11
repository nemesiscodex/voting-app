'use strict';

angular.module('workspaceApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': '<i class="line chart icon"></i> Trending',
      'link': '/polls'
    },{
      'needAuth': true,
      'title': '<i class="pie chart icon"></i> My Polls',
      'link': '/polls/mine'
    },{
      'needAuth': true,
      'title': '<i class="plus icon"></i> New Poll',
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