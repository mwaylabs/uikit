/**
 * Created by zarges on 23/02/16.
 */
angular.module('mwUI.Menu', [])

  .provider('mwSidebarMenu', function () {

    var mwMenu = new mwUI.Menu.MwMenu();

    this.getMenu = function () {
      return mwMenu;
    };

    this.$get = function () {
      return mwMenu;
    };

  });