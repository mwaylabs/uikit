angular.module('mwUI.Utils')

  .factory('LeaveConfirmationModal', function (Modal) {
    return Modal.prepare({
      templateUrl: 'uikit/mw-utils/modals/templates/mw_leave_confirmation_modal.html',
      controller: 'LeaveConfirmationModalController'
    });
  })

  .controller('LeaveConfirmationModalController', function ($scope) {
    $scope.stay = function () {
      $scope.stayCallback();
      $scope.hideModal();
    };

    // User really wants to navigate to that page which was saved before in a temp variable
    $scope.continue = function () {
      if ($scope.nextUrl) {
        //hide the modal and navigate to the page
        $scope.leaveCallback();
        $scope.hideModal().then(function () {
          document.location.href=$scope.nextUrl;
        });
      } else {
        throw new Error('NextUrl has to be set!');
      }
    };
  });