angular.module('mwUI.Menu')

  .directive('mwMenuTopEntries', function ($rootScope, $timeout) {
    return {
      scope: {
        menu: '=mwMenuTopEntries',
        right: '='
      },
      transclude: true,
      templateUrl: 'uikit/mw-menu/directives/templates/mw_menu_top_entries.html',
      controller: function ($scope) {
        var menu = $scope.menu || new mwUI.Menu.MwMenu();

        this.getMenu = function () {
          return menu;
        };
      },
      link: function (scope, el, attrs, ctrl) {
        var timeouts = [],
          isDestroyed = false;

        scope.entries = ctrl.getMenu();

        var issueResort = function () {
          // Unfortunately there is no easy way to cancel a throttled function (https://github.com/jashkenas/underscore/pull/952#issuecomment-12867693)
          // So we have to check if is is not destroyed already. Actually we would cancel the throttled function during destroy
          if (isDestroyed) {
            return;
          }
          timeouts.push(
            $timeout(function () {
              scope.entries.sort();
              scope.$broadcast('mw-menu:resort');
            })
          );
        };
        var throttledIssueResort = _.throttle(issueResort, 1);

        var issueReorder = function () {
          // Unfortunately there is no easy way to cancel a throttled function (https://github.com/jashkenas/underscore/pull/952#issuecomment-12867693)
          if (isDestroyed) {
            return;
          }
          timeouts.push(
            $timeout(function () {
              scope.$broadcast('mw-menu:reorder');
            })
          );
        };
        var throttledIssueReorder = _.throttle(issueReorder, 1);

        scope.$on('mw-menu:triggerReorder', throttledIssueReorder);

        scope.$on('mw-menu:triggerResort', throttledIssueResort);

        scope.entries.on('add remove reset', throttledIssueReorder);

        scope.$on('$destroy', function () {
          isDestroyed = true;
          timeouts.forEach(function (timeoutPromise) {
            $timeout.cancel(timeoutPromise);
          });
          scope.entries.off('add remove reset', throttledIssueReorder);
        });
      }
    };
  });