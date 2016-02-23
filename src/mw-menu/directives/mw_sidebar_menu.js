/**
 * Created by zarges on 23/02/16.
 */
angular.module('mwUI.Menu')

  .directive('mwSidebarMenu', function (mwSidebarMenu) {
    return {
      templateUrl: 'uikit/mw-menu/directives/templates/mw_sidebar_menu.html',
      transclude: true,
      controllerAs: 'ctrl',
      controller: function(){
        this.mwMenu = mwSidebarMenu;
      }
    };
  });