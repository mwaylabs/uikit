angular.module('mwUI.List')
//TODO rename to mwListUrlActionButton
  .directive('mwListableLinkShowBb', function ($window) {
    return {
      restrict: 'A',
      require: '^mwListableBb',
      templateUrl: 'uikit/mw-list/directives/templates/mw_list_url_action_button.html',
      scope: {
        link: '@mwListableLinkShowBb',
        target: '@linkTarget'
      },
      link: function (scope) {
        scope.execute = function () {
            var link = scope.link,
              target = scope.target;

            if (link && !target) {
              debugger;
              $window.location.href = link;
            } else if (link && target && target !== 'self') {
              window.open(link);
            }
        }
      }
    };
  });