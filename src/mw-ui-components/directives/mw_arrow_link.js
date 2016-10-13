angular.module('mwUI.UiComponents')

  //Todo rename
  .directive('mwLinkShow', function () {
    return {
      restrict: 'A',
      scope: {
        link: '@mwLinkShow'
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_arrow_link.html'
    };
  });
