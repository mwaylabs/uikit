'use strict';

angular.module('mwUI.Toast')

  .directive('mwToasts', function (Toast) {
    return {
      templateUrl: 'uikit/mw-toast/directives/templates/mw_toasts.html',
      link: function (scope) {
        scope.toasts = Toast.getToasts();

        scope.$watch(function () {
          return Toast.getToasts().length;
        }, function () {
          scope.toasts = Toast.getToasts();
        });

        scope.hideToast = function (toastId) {
          Toast.removeToast(toastId);
        };
      }
    };
  });
