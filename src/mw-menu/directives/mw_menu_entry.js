/**
 * Created by zarges on 23/02/16.
 */
angular.module('mwUI.Menu')

  .directive('mwMenuEntry', function () {
    return {
      scope: {},
      bindToController: {
        entry: '=mwMenuEntry'
      },
      templateUrl: 'uikit/mw-menu/directives/templates/mw_menu_entry.html',
      controllerAs: 'menuEntryCtrl',
      controller: function($rootScope, $location){
        this.isActive = this.entry.isActiveForUrl($location.url());

        $rootScope.$on('$locationChangeSuccess', function () {
          this.isActive = this.entry.hasActiveSubEntryOrIsActiveForUrl($location.url());
        }.bind(this));
      }
    };
  });