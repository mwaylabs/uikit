/**
 * Created by zarges on 23/02/16.
 */
angular.module('mwUI.Menu')

  .directive('mwMenuSubEntry', function () {
    return {
      scope: {},
      bindToController: {
        entry: '=mwMenuSubEntry'
      },
      templateUrl: 'uikit/mw-menu/directives/templates/mw_menu_sub_entry.html',
      controllerAs: 'menuSubEntryCtrl',
      controller: function($rootScope, $location){
        this.isActive = this.entry.isActiveForUrl($location.url());

        $rootScope.$on('$locationChangeSuccess', function () {
          this.isActive = this.entry.hasActiveSubEntryOrIsActiveForUrl($location.url());
        }.bind(this));
      }
    };
  });