angular.module('mwUI.UiComponents')
//TODO rename
  .directive('mwTabsPane', function () {
    return {
      scope: {
        title: '@mwTabsPane',
        id: '@?',
        icon: '@?',
        tooltip: '@?',
        badge: '@?',
        isInvalid: '=?'
      },
      transclude: true,
      replace: true,
      require: ['^mwTabs', '^?form'],
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_tab_pane.html',
      controller: function ($scope) {
        var selected = false;
        $scope.getId = function () {
          return $scope.id || $scope.$id;
        };

        $scope.deselect = function () {
          selected = false;
        };

        $scope.select = function () {
          selected = true;
        };

        $scope.isSelected = function () {
          return selected;
        };
      },
      link: function (scope, el, attr, mwTabsCtrl) {
        mwTabsCtrl.registerPane(scope);

        scope.$on('$destroy', function () {
          el.remove();
          scope.deselect();
          mwTabsCtrl.unRegisterPane(scope);
        });
      }
    };
  });