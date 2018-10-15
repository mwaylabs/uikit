angular.module('mwUI.Menu')

  .directive('mwMenuTopItem', function ($timeout) {
    return {
      scope: {
        entry: '=mwMenuTopItem'
      },
      templateUrl: 'uikit/mw-menu/directives/templates/mw_menu_top_item.html',
      link: function(scope){
        scope.executeAction = function(){
          $timeout(function(){
            var action = scope.entry.get('action');
            if(action && typeof action === 'function' ){
              action();
            }
          });
        };
      }
    };
  });