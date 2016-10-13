angular.module('mwUI.UiComponents')

  .directive('mwAlert', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        type: '@mwAlert'
      },
      transclude: true,
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_alert.html'
    };
  });