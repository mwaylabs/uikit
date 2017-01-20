angular.module('mwUI.Menu')

  .directive('mwMenuTop', function ($rootScope, $timeout) {
    return {
      scope: {
        menu: '=mwMenuTop'
      },
      transclude: true,
      templateUrl: 'uikit/mw-menu/directives/templates/mw_menu_top.html',
      controller: function(){
        var menu = new mwUI.Menu.MwMenu();

        this.getMenu = function(){
          return menu;
        };
      },
      link: function(scope, el, attrs, ctrl){
        scope.entries = ctrl.getMenu();

        scope.unCollapse = function() {
          var collapseEl = el.find('.navbar-collapse');
          if(collapseEl.hasClass('in')) {
            collapseEl.collapse('hide');
          }
        };

        $rootScope.$on('$locationChangeSuccess', function(){
          scope.unCollapse();
        });

        scope.$on('mw-menu:triggerReorder', _.throttle(function(){
          $timeout(function(){
            scope.$broadcast('mw-menu:reorder');
          });
        }));

        scope.$on('mw-menu:triggerResort', _.throttle(function(){
          $timeout(function(){
            scope.$broadcast('mw-menu:resort');
            scope.entries.sort();
          });
        }));
      }
    };
  });