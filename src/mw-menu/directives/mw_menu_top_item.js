angular.module('mwUI.Menu')

  .directive('mwMenuTopItem', function ($rootScope, $location) {
    return {
      scope: {
        entry: '=mwMenuTopItem'
      },
      templateUrl: 'uikit/mw-menu/directives/templates/mw_menu_top_item.html',
      link: function(scope){
        var isActive;

        var setIsActiveState = function(){
          isActive = scope.entry.isActiveForUrl($location.url());
        };

        scope.isActive = function(){
          return isActive
        };

        setIsActiveState();
        $rootScope.$on('$locationChangeSuccess', setIsActiveState);
      }
    };
  });