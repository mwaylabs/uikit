angular.module('mwUI.Menu')

  .directive('mwMenuToggleActiveClass', function ($rootScope, $location, $timeout) {
    return {
      scope: {
        entry: '=mwMenuToggleActiveClass',
        isActive: '&'
      },
      link: function (scope, el) {
        var setIsActiveState = function () {
          $timeout(function () {
            var url = $location.url(),
              hadClass = el.hasClass('active');

            if (scope.entry.hasActiveSubEntryOrIsActiveForUrl(url)) {
              el.addClass('active');
            } else {
              el.removeClass('active');
            }

            if (hadClass !== el.hasClass('active')) {
              scope.$emit('menu-toggle-active-class-changed', el.hasClass('active'));
            }
          });
        };

        if (scope.entry && scope.entry.get('isActive')) {
          scope.$watch(function () {
            return scope.entry.get('isActive')();
          }, setIsActiveState);
        }

        setIsActiveState();
        $rootScope.$on('menu-toggle-active-class-changed', setIsActiveState);
        $rootScope.$on('$locationChangeSuccess', setIsActiveState);
        $rootScope.$on('$routeChangeError', setIsActiveState);
      }
    };
  });