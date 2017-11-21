angular.module('mwUI.UiComponents')
//TODO rename
/**
 * @example ```html
 * <!-- change callback example -->
 * <div mw-tabs active-pane-number="myCtrl.activePane" tab-changed="myCtrl.tabChanged">
 <div mw-tabs-pane="{{'mytitle'| i18n}}">
 Tab 1
 </div>
 <div mw-tabs-pane="{{'mytitle_2'| i18n}}">
 Tab 2
 </div>
 </div>
 * ```
 */
  .directive('mwTabs', function ($rootScope) {
    return {
      transclude: true,
      scope: {
        justified: '=?',
        activePaneNumber: '=?',
        activePaneId: '@?',
        tabChanged: '=?'
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_tab_bar.html',
      controller: function ($scope) {
        var panes = $scope.panes = [],
          activeNumber;

        var setInitialSelection = function () {
          activeNumber = null;
          if (angular.isUndefined($scope.activePaneNumber) && angular.isUndefined($scope.activePaneId)) {
            $scope.select(panes[0]);
          } else if (angular.isDefined($scope.activePaneNumber)) {
            $scope.selectTabByNumber($scope.activePaneNumber);
          } else if (angular.isDefined($scope.activePaneId)) {
            $scope.selectTabById($scope.activePaneId);
          }
        };

        var throttledSetInitialSelection = _.debounce(setInitialSelection, 100);

        $scope.getActivePane = function () {
          var activePane;
          $scope.panes.every(function (pane) {
            if (pane.isSelected()) {
              activePane = pane;
              return false;
            }
            return true;
          });
          return activePane;
        };

        $scope.select = function (newPane) {
          var newActivePaneNumber = _.indexOf($scope.panes, newPane) + 1;

          if (newPane && newActivePaneNumber > 0 && newActivePaneNumber !== activeNumber) {
            var previousSelectedPane = $scope.getActivePane();
            if (previousSelectedPane) {
              previousSelectedPane.deselect();
            }

            newPane.select();
            activeNumber = newActivePaneNumber;

            if ($scope.tabChanged && typeof $scope.tabChanged === 'function') {
              $scope.tabChanged(activeNumber, newPane, previousSelectedPane);
              $rootScope.$emit('$mwTabChange');
            }
          }
        };

        $scope.selectTabByNumber = function (number) {
          if (number > 0 && number <= $scope.tabs.length) {
            $scope.select(panes[number - 1]);
          }
        };

        $scope.selectTabById = function (id) {
          $scope.panes.every(function (pane) {
            if (pane.getId() === id) {
              $scope.select(pane);
              return false;
            }
            return true;
          });
        };

        // add a change listener on the pane
        $scope.$watch('activePaneNumber', function (_new, _old) {
          if (_new && _new !== _old) {
            $scope.selectTabByNumber(_new);
          }
        });

        $scope.$watch('activePaneId', function (_newId) {
          if (_newId) {
            $scope.selectTabById(_newId);
          }
        });

        this.registerPane = function (pane) {
          panes.push(pane);
          throttledSetInitialSelection();
        };

        this.unRegisterPane = function (pane) {
          if (pane) {
            var indexOfExistingPane = _.indexOf(panes, pane);
            if (indexOfExistingPane !== -1) {
              $scope.panes.splice(indexOfExistingPane, 1);
            }
            throttledSetInitialSelection();
          }
        };
      }
    };
  });