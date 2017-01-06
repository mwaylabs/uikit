angular.module('mwUI.Menu')

  .directive('mwMenuDivider', function () {
    return {
      scope: {
        id: '@',
        label: '@',
        order: '='
      },
      templateUrl: 'uikit/mw-menu/directives/templates/mw_menu_divider.html'
    };
  });