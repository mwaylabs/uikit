angular.module('mwUI.Utils')

  .directive('mwAppendRouteClass', function () {
    return {
      link: function (scope, el) {
        var orgClasses = el.attr('class');
        var removeClassesFromPreviousRoute = function () {
          el.attr('class', orgClasses);
        };

        scope.$on('$routeChangeSuccess', function (event, current) {
          removeClassesFromPreviousRoute();
          if (current && current.cssClasses) {
            el.addClass(current.cssClasses);
          }
        });
      }
    };
  });