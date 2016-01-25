'use strict';

angular.module('mwTabs', [])

    .directive('mwTabs', function () {
      return {
        restrict: 'A',
        replace: true,
        scope: {
          justified: '=',
          activePaneNumber: '='
        },
        transclude: true,
        templateUrl: 'uikit/templates/mwTabs.html',
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
    })

    .directive('mwTabsPane', function () {
      return {
        restrict: 'A',
        scope: {
          title: '@mwTabsPane',
          isInvalid: '='
        },
        replace: true,
        transclude: true,
        require: '^mwTabs',
        template: '<div class="tab-pane" ng-class="{active: selected}" ng-transclude></div>',
        link: function (scope, elm, attr, mwTabsCtrl) {
          mwTabsCtrl.registerPane(scope);
        }

      };
    });