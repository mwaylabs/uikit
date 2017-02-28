angular.module('mwUI.Layout')

  .directive('mwFooter', function () {
    return {
      transclude: true,
      scope: {
        type: '@mwFooter'
      },
      templateUrl: 'uikit/mw-layout/directives/templates/mw_footer.html'
    };
  });