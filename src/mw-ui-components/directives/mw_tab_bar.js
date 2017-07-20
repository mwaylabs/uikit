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
  .directive('mwTabs', function () {
    return {
      transclude: true,
      scope: {
        justified: '=',
        activePaneNumber: '=',
        tabChanged: '='
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_tab_bar.html',
      controller: function ($scope) {
        var panes = $scope.panes = [];

        $scope.select = function (pane) {
          angular.forEach(panes, function (p) {
            p.selected = false;
          });

          if($scope.activePaneNumber){
            $scope.activePaneNumber = _.indexOf($scope.panes,pane)+1;
          }

          pane.selected = true;
          // emit the callback
          if ($scope.tabChanged && typeof $scope.tabChanged === 'function') {
            $scope.tabChanged($scope.activePaneNumber);
          }
        };
        
        // add a change listener on the pane 
        if ($scope.tabChanged && typeof $scope.tabChanged === 'function') { 
          $scope.$watch('activePaneNumber', function (_new, _old) {
            if (_new !== _old && panes && panes[_new - 1]) {
              $scope.select(panes[_new - 1]);
            }
          });
        }

        this.registerPane = function (pane) {
          if ( ( $scope.activePaneNumber && $scope.activePaneNumber-1 === panes.length) || (!panes.length && !$scope.activePaneNumber) ) {
            var bak = $scope.activePaneNumber;
            $scope.select(pane);
            $scope.activePaneNumber = bak;
          }
          panes.push(pane);
        };
      }
    };
  });