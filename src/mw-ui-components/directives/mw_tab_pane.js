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
      link: function (scope, el, attr, ctrls) {
        var mwTabsCtrl = ctrls[0],
            formCtrl = ctrls[1];

        mwTabsCtrl.registerPane(scope);

        scope.$on('$destroy', function () {
          el.remove();
          scope.deselect();
          mwTabsCtrl.unRegisterPane(scope);
        });

        // Do not use ng-if to remove the transcluded tab pane content when the tab pane is in a `Form`
        // Validation does not work when the content is removed from the dom
        // When you have a tab bar with multiple tabs and each tab contains required input, the tab pane content
        // must be always in the dom so the form controller knows that the inputs are existing
        scope.canUseNgIf = function(){
          return !formCtrl;
        };
      }
    };
  });