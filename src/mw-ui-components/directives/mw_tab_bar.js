angular.module('mwUI.UiComponents')
  //TODO rename
  .directive('mwTabs', function () {
    return {
      transclude: true,
      scope: {
        justified: '=',
        activePaneNumber: '='
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
        };

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