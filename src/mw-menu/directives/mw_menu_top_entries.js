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
        scope.entries = ctrl.getMenu();

        scope.$on('mw-menu:triggerReorder', _.throttle(function () {
          $timeout(function () {
            scope.$broadcast('mw-menu:reorder');
          });
        }));

        scope.$on('mw-menu:triggerResort', _.throttle(function () {
          $timeout(function () {
            scope.$broadcast('mw-menu:resort');
            scope.entries.sort();
          });
        }));

        scope.entries.on('add remove reset', _.throttle(function () {
          $timeout(function () {
            scope.$broadcast('mw-menu:reorder');
          });
        }));
      }
    };
  });