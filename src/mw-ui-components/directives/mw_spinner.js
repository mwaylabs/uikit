angular.module('mwUI.UiComponents')

  .directive('mwSpinner', function () {
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_spinner.html'
    };
  });