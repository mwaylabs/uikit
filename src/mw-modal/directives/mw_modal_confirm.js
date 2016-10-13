angular.module('mwUI.Modal')

  .directive('mwModalConfirm', function () {
    return {
      restrict: 'A',
      transclude: true,
      scope: true,
      templateUrl: 'uikit/mw-modal/directives/templates/mw_modal_confirm.html',
      link: function (scope, elm, attr) {
        angular.forEach(['ok', 'cancel'], function (action) {
          scope[action] = function () {
            scope.$eval(attr[action]);
          };
        });
      }
    };
  });