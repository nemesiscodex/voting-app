'use strict';

//Check if local storage is available
function storageAvailable(type) {
  try {
    var storage = window[type],
      x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch (e) {
    return false;
  }
}

angular.module('workspaceApp')
  .controller('MainCtrl', function ($scope, $http, $translate, Auth) {
    $scope.isLoggedInAsync = Auth.isLoggedInAsync;
    $scope.isLoggedIn = Auth.isLoggedIn;

    $scope.isLoggedInAsync(function(loggedIn){
      if(storageAvailable('localStorage') && loggedIn){
        var next = localStorage.getItem('next');
        localStorage.removeItem('next');
        if(next)
          location.href = next;
      }
    });


    $translate('MAIN.OR').then(function(or){
      angular.element('#main-style').html('.signup-login .ui.buttons .or:before{ content: "' + or + '" !important; }');
    })
  });
