angular.module('mwUI.Layout')

  .directive('mwSidebar', function () {
    return {
      transclude: true,
      templateUrl: 'uikit/mw-layout/directives/templates/mw_sidebar.html',
      link: function (scope, el) {
        var sidebarEl = el.find('.mw-sidebar'),
          footerEl = angular.element('.mw-footer'),
          headerEl = angular.element('.mw-header'),
          navbarEl = angular.element('.mw-menu-top-bar');

        var setMaxHeight = function () {
          var docHeight = angular.element(window).innerHeight(),
            maxHeight = docHeight;

          if (headerEl.length) {
            maxHeight -= headerEl.height();
          }

          if (navbarEl.length) {
            maxHeight -= navbarEl.height();
          }

          if (footerEl.length) {
            maxHeight -= footerEl.height();
          }

          sidebarEl.css('maxHeight', maxHeight);
        };

        var throttledSetMaxHeight = _.throttle(setMaxHeight, 100);

        setMaxHeight();
        angular.element(window).on('resize', throttledSetMaxHeight);

        scope.$on('$destroy', function () {
          angular.element(window).off('resize', throttledSetMaxHeight);
        });
      }
    };
  });