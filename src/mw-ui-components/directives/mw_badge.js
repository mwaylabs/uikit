angular.module('mwUI.UiComponents')
  //TODO remove this or add functionality to make it useful
  .directive('mwBadge', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: {mwBadge: '@'},
      transclude: true,
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_badge.html'
    };
  });