'use strict';

describe('Controller: PollsNewCtrl', function () {

  // load the controller's module
  beforeEach(module('workspaceApp'));

  var PollsNewCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PollsNewCtrl = $controller('PollsNewCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
