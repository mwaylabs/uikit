angular.module('mwUI.Layout')

  .directive('mwSubNav', function () {
    return {
      restrict: 'A',
      scope: {
        justified: '='
      },
      transclude: true,
      replace: true,
      templateUrl: 'uikit/mw-layout/directives/templates/mw_sub_nav.html'
    };
  });