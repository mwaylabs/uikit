'use strict';

angular.module('mwTabs', [])

    .directive('mwTabs', function () {
      return {
        restrict: 'A',
        replace: true,
        scope: {
          justified: '='
        },
        transclude: true,
        templateUrl: 'modules/ui/templates/mwTabs.html',
        controller: function ($scope) {
          var panes = $scope.panes = [];

          $scope.select = function (pane) {
            angular.forEach(panes, function (p) {
              p.selected = false;
            });
            pane.selected = true;
          };

          this.registerPane = function (pane) {
            if (!panes.length) {
              $scope.select(pane);
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