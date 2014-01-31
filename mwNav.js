'use strict';

angular.module('mwNav', [])

  .directive('mwSubNav', function () {
    return {
      restrict: 'A',
      scope: {
        justified: '='
      },
      replace:true,
      transclude: true,
      template: '<div class="mw-nav"><ul class="nav nav-pills" ng-class="{\'nav-justified\':justified}" ng-transclude></ul></div>'
    };
  })

  .directive('mwSubNavPill', function ($location) {
    return {
      restrict: 'A',
      scope: {
        url: '@mwSubNavPill',
        disabled:'='
      },
      transclude: true,
      replace: true,
      template: '<li><a ng-href="{{url}}" ng-transclude></a></li>',
      link: function (scope, elm) {
        var setActiveClassOnUrlMatch = function(url){
          if(scope.url && url === scope.url.slice(1)){
            elm.addClass('active');
          } else {
            elm.removeClass('active');
          }
        };

        scope.$watch('url',function(newUrlAttr){
          if(newUrlAttr){
            setActiveClassOnUrlMatch($location.$$path);
          }
        });

        /* FIXME ADD DISABLED URL WHICH IS NOT CLICKABLE*/
        if(typeof scope.disabled !== 'undefined' && !scope.disabled){
          scope.clickUrl = scope.url;
        } else {
          scope.clickUrl = null;
        }

        setActiveClassOnUrlMatch($location.$$path);

      }

    };
  });