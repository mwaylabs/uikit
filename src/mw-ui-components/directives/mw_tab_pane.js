angular.module('mwUI.UiComponents')
//TODO rename
/**
 * @ngdoc directive
 * @name mwUI.UiComponents.directive:mwTabsPane
 *
 * @description TabPane content. Requires mwTabs as parent. Defines title, icon, tooltip, etc for the tab
 *
 * @param {mwTabsPane} string defines the title of the tab
 * @param {id} number defines the id. Is required when you want to select a tab by id
 * @param {icon} string defines the icon of the tab. Not displayed when not set
 * @param {tooltip} string defines the tooltip of the tab. Not displayed when not set
 * @param {badge} string defines the badge of the tab. Not displayed when not set
 * @param {isInvalid} boolean defines whether the tab should be displayed in error state.
 */
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
      require: ['^mwTabs'],
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

        this.isSelected = $scope.isSelected = function () {
          return selected;
        };
      },
      link: function (scope, el, attr, ctrls) {
        var mwTabsCtrl = ctrls[0];

        mwTabsCtrl.registerPane(scope);

        scope.$on('$destroy', function () {
          el.remove();
          scope.deselect();
          mwTabsCtrl.unRegisterPane(scope);
        });

        // Use ng-if to remove the transcluded tab pane content when the parent `mwTabs` controller allows it
        // Set scope attribute `removeInactiveContent` on `mwTabs` to controll the behaviour. For complex content
        // that is transcluded it is recommended to `removeInactiveContent` to true but be aware that it is a bit
        // slower. However, it may have a possitive impact on the genral performance especially when the transluded content
        // registeres a lot of event listeners and stuff
        scope.canUseNgIf = function () {
          var tabBarAllowsIt = mwTabsCtrl.canRemoveInactiveContent();
          if (mwTabsCtrl && angular.isDefined(tabBarAllowsIt)) {
            return tabBarAllowsIt;
          } else {
            return false;
          }
        };

        scope.isInitialised = true;
      }
    };
  });