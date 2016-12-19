angular.module('mwUI.Menu')

  .directive('mwMenuTopBar', function () {
    return {
      scope: {
        logo: '@'
      },
      transclude: true,
      templateUrl: 'uikit/mw-menu/directives/templates/mw_menu_top_bar.html'
    };
  });