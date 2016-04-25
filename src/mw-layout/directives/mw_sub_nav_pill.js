angular.module('mwUI.Layout')

  .directive('mwSubNavPill', function ($location) {
    return {
      restrict: 'A',
      scope: {
        url: '@mwSubNavPill',
        mwDisabled: '='
      },
      transclude: true,
      replace: true,
      templateUrl: 'uikit/mw-layout/directives/templates/mw_sub_nav_pill.html',
      link: function (scope, elm) {
        var setActiveClassOnUrlMatch = function (url) {
          if (scope.url && url === scope.url.slice(1)) {
            elm.addClass('active');
          } else {
            elm.removeClass('active');
          }
        };

        scope.$watch('url', function (newUrlAttr) {
          if (newUrlAttr) {
            setActiveClassOnUrlMatch($location.$$path);
          }
        });

        scope.navigate = function(url){
          if(!scope.mwDisabled){
            url = url.replace(/#\//,'');
            $location.path(url);
            $location.replace();
          }
        };

        setActiveClassOnUrlMatch($location.$$path);

      }
    };
  });