'use strict';

angular.module('SampleApp.Start')

  .factory('TestModal', function (Modal) {
    return Modal.prepare({
      templateUrl: 'modules/start/modals/templates/test_modal.html',
      controller: 'TestModalController'
    });
  })

  .controller('TestModalController', function () {

  });