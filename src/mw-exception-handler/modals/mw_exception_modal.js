angular.module('mwUI.ExceptionHandler')

  .factory('ExceptionModal', function (Modal) {
    return Modal.prepare({
      templateUrl: 'uikit/mw-utils/modals/templates/mw_exception_modal.html',
      controller: 'ExceptionModalController'
    });
  })

  .controller('ExceptionModalController', function ($scope, $q, Wizard) {
    $scope.exception = null;

    $scope.wizard =  Wizard.createWizard('exception');

    $scope.report = function(){
      $q.when($scope.successCallback()).then(function(){
        $scope.wizard.next();
      });
    };

    $scope.cancel = function(){
      if($scope.errorCallback){
        $q.when($scope.errorCallback()).then(function(){
          $scope.hideModal();
        });
      } else {
        $scope.hideModal();
      }
    };

    $scope.close = function(){
      $scope.hideModal();
    };
  });