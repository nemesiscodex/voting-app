'use strict';

angular.module('workspaceApp')
  .controller('SettingsCtrl', function ($scope, User, Auth, $translate, $route) {
    $scope.errors = {};
    $scope.isLoggedIn = Auth.isLoggedIn;
    $translate(['SETTINGS.LANGUAGE_ENGLISH', 'SETTINGS.LANGUAGE_SPANISH']).then(function(translations){
      console.log(translations)
      $scope.languages = [{
        name: translations['SETTINGS.LANGUAGE_ENGLISH'],
        flag: 'us',
        key: 'en'
      },{
        name: translations['SETTINGS.LANGUAGE_SPANISH'],
        flag: 'es',
        key: 'es'
      }];
    });

    $scope.changeLanguage = function (langKey) {
      $translate.use(langKey);
      $route.reload();
    };

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};
  });
