'use strict';

angular.module('workspaceApp')
  .controller('PollsNewCtrl', function ($scope, $location, $http) {
    $scope.poll = {
    	name: '',
    	items: [
    		{name: '', votes: 0},
    		{name: '', votes: 0}
    	]
    };

    $scope.addQuestion = function () {
    	$scope.poll.items.push({name: '', votes: 0})
    };

    $scope.errors = {};

    $scope.addPoll = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        $http.post('/api/polls', $scope.poll)
        .then( function(response) {
          var newPoll = response.data;
          $location.path('/polls/'+ newPoll._id)
        }, function() {
            form.name.$setValidity('mongoose', false);
            $scope.message = 'Cannot create new Poll.';
        });
      }
		};
  });
