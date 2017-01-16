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
      link: function (scope, el) {
        if (scope.linkTarget) {
          el.find('a').attr('target', scope.linkTarget);
        }
      }
    };
  });
