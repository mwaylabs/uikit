angular.module('mwUI.Menu')

  .directive('mwMenuTop', function () {
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
        }
      },
      link: function(scope, el, attrs, ctrl){
        scope.entries = ctrl.getMenu();

        scope.unCollapse = function() {
          var collapseEl = el.find('.navbar-collapse');
          if(collapseEl.hasClass('in')) {
            collapseEl.collapse('hide');
          }
        };

        scope.$on('nav:uncollapse', function(){
          console.log('UNCOLLAPSE');
          scope.unCollapse();
        })
      }
    };
  });