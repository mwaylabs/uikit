angular.module('mwUI.Utils')

  .directive('mwLeaveConfirmation', function ($window, $rootScope, LeaveConfirmationModal) {
    return {
      scope: {
        alertBeforeLeave: '=mwLeaveConfirmation',
        text: '@'
      },
      link: function (scope) {

        var confirmationModal = new LeaveConfirmationModal();

        // Prevent the original event so the routing will not be completed
        // Save the url where it should be navigated to in a temp variable
        var showConfirmModal = function (nextUrl) {
          confirmationModal.setScopeAttributes({
            nextUrl: nextUrl,
            text: scope.text,
            leaveCallback: function () {
              scope.changeLocationOff();
            },
            stayCallback: function () {

            }
          });
          confirmationModal.show();
        };

        //In case that just a hashchange event was triggered
        scope.changeLocationOff = $rootScope.$on('$locationChangeStart', function (ev, nextUrl) {
          if (scope.alertBeforeLeave) {
            ev.preventDefault();
            showConfirmModal(nextUrl);
          }
        });

        //In case that the user clicks the refresh/back button or makes a hard url change
        $window.onbeforeunload = function () {
          if (scope.alertBeforeLeave) {
            return scope.text;
          }
        };

        if (!angular.isDefined(scope.text)) {
          throw new Error('Please specify a text in the text attribute');
        }

        scope.$on('$destroy', scope.changeLocationOff);
      }
    };
  });
