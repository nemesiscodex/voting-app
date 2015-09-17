'use strict';

angular.module('workspaceApp')
  .controller('MainCtrl', function ($scope, $http, $translate, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;

    $translate('MAIN.OR').then(function(or){
      angular.element('#main-style').html('.signup-login .ui.buttons .or:before{ content: "' + or + '" !important; }');
    })
  });
