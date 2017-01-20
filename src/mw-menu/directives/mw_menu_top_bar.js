angular.module('mwUI.Menu')

  .directive('mwMenuTopBar', function () {
    return {
      transclude: {
        'brand': '?img',
        'entries': '?div'
      },
      templateUrl: 'uikit/mw-menu/directives/templates/mw_menu_top_bar.html'
    };
  });