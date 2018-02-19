angular.module('mwUI.Menu')

  .directive('mwMenuTopBar', function ($rootScope) {
    return {
      transclude: {
        'brand': '?img',
        'entries': '?div'
      },
      templateUrl: 'uikit/mw-menu/directives/templates/mw_menu_top_bar.html',
      require: '^?mwUi',
      link: function (scope, el, attrs, mwUiCtrl) {
        if (mwUiCtrl) {
          mwUiCtrl.addClass('has-mw-menu-top-bar');
        }

        scope.closeMenu = function () {
          var collapseEl = el.find('.navbar-collapse');

          if (collapseEl.hasClass('in')) {
            collapseEl.collapse('hide');
          }
        };

        var throttledCloseMenu = _.throttle(scope.closeMenu, 200),
          unBindLocationListener = $rootScope.$on('$locationChangeStart', throttledCloseMenu);

        angular.element(window).on('resize', throttledCloseMenu);

        scope.$on('$destroy', function () {
          unBindLocationListener();
          angular.element(window).off('resize', throttledCloseMenu);
          if (mwUiCtrl) {
            mwUiCtrl.removeClass('has-mw-menu-top-bar');
          }
        });
      }
    };
  });