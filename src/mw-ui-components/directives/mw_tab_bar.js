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
        // The panes are populated by the mw-tabs-pane directive that is calling `registerPane`of this controller
        // It is defined as a scope attribute so it is available in this html template
        var activePaneIndex;

        $scope.panes = [];

        var setInitialSelection = function () {
          activePaneIndex = null;

          // In case that no active pane is defined by setting activePaneNumber or Id the first pane will be selected
          if (angular.isUndefined($scope.activePaneNumber) && angular.isUndefined($scope.activePaneId) && $scope.panes.length>0) {
            $scope.select($scope.panes[0]);

          // When a pane number is defined the pane with the index of activePaneNumber + 1 will be selected
          // So when the second tab shall be selected set activePaneNumber to 2
          } else if (angular.isDefined($scope.activePaneNumber)) {
            $scope.selectTabByNumber($scope.activePaneNumber);

          // When a pane id is defined the pane where the pane id equals the activePaneId will be selected
          // Make sure to set an id on the mw-tab-pane
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
          var newPaneIndex = _.indexOf($scope.panes, newPane);

          if (newPane && newPaneIndex !== -1 && newPaneIndex !== activePaneIndex) {
            var previousSelectedPane = $scope.getActivePane();
            if (previousSelectedPane) {
              previousSelectedPane.deselect();
            }

            newPane.select();
            activePaneIndex = newPaneIndex;

            if ($scope.tabChanged && typeof $scope.tabChanged === 'function') {
              $scope.tabChanged(activePaneIndex + 1, newPane, previousSelectedPane);
              $rootScope.$emit('$mwTabChange');
            }
          }
        };

        $scope.selectTabByNumber = function (number) {
          if (number > 0 && number <= $scope.panes.length) {
            $scope.select($scope.panes[number - 1]);
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
          $scope.panes.push(pane);
          throttledSetInitialSelection();
        };

        this.unRegisterPane = function (pane) {
          if (pane) {
            var indexOfExistingPane = _.indexOf($scope.panes, pane);
            if (indexOfExistingPane !== -1) {
              $scope.panes.splice(indexOfExistingPane, 1);
            }
            throttledSetInitialSelection();
          }
        };
      }
    };
  });