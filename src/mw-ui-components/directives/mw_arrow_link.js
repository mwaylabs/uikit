angular.module('mwUI.UiComponents')

  //Todo rename
  .directive('mwLinkShow', function () {
    return {
      restrict: 'A',
      scope: {
        link: '@mwLinkShow',
        linkTarget: '@?'
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_arrow_link.html',
      link: function (scope, elm) {
        if (scope.linkTarget) {
          elm.attr('target', scope.linkTarget);
        }
      }
    };
  });
