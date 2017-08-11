angular.module('mwUI.Menu')

  .directive('mwMenuTopBar', function () {
    return {
      transclude: {
        'brand': '?img',
        'entries': '?div'
      },
      templateUrl: 'uikit/mw-menu/directives/templates/mw_menu_top_bar.html',
      require: '^?mwUi',
      link: function(scope, el, attrs, mwUiCtrl){
        if(mwUiCtrl){
          mwUiCtrl.addClass('has-mw-menu-top-bar');
          scope.$on('$destroy', function(){
            mwUiCtrl.removeClass('has-mw-menu-top-bar');
          });
        }
      }
    };
  });