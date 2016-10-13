/**
 * Created by zarges on 23/02/16.
 */
angular.module('mwUI.Menu', [])

  .provider('mwSidebarMenu', function () {

    var mwMenu = new mwUI.Menu.MwMenu(),
        logoUrl;

    this.getMenu = function () {
      return mwMenu;
    };

    this.setLogoUrl = function(url){
      logoUrl = url;
    };

    this.getLogoUrl = function(){
      return logoUrl;
    };

    this.$get = function () {
      return this;
    };

  });