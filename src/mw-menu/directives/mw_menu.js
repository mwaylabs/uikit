/**
 * Created by zarges on 23/02/16.
 */
angular.module('mwUI.Menu')

  .directive('mwMenu', function () {
    return {
      scope: {
        menu: '=mwMenu'
      },
      templateUrl: 'uikit/mw-menu/directives/templates/mw_menu.html'
    };
  });