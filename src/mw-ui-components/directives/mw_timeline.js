angular.module('mwUI.UiComponents')

  .directive('mwTimeline', function () {
    return {
      transclude: true,
      replace: true,
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_timeline.html'
    };
  });