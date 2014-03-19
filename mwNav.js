'use strict';

angular.module('mwNav', [])

    .directive('mwSubNav', function () {
      return {
        restrict: 'A',
        scope: {
          justified: '='
        },
        replace: true,
        transclude: true,
        template: '<div class="mw-nav"><ul class="nav nav-pills" ng-class="{\'nav-justified\':justified}" ng-transclude></ul></div>'
      };
    })

    .directive('mwSubNavPill', function ($location) {
      return {
        restrict: 'A',
        scope: {
          url: '@mwSubNavPill',
          disabled: '='
        },
        transclude: true,
        replace: true,
        template: '<li><a ng-href="{{url}}" ng-transclude></a></li>',
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

          /* FIXME ADD DISABLED URL WHICH IS NOT CLICKABLE*/
//        if(typeof scope.disabled !== 'undefined' && !scope.disabled){
//          scope.clickUrl = scope.url;
//        } else {
//          scope.clickUrl = null;
//        }

          setActiveClassOnUrlMatch($location.$$path);

        }
      };
    })

    .directive('mwNavbar', function ($location) {
      return {
        transclude: true,
        replace: true,
        templateUrl: 'modules/ui/templates/mwNav/mwNavbar.html',
        controller: function () {
          this.isActive = function (path, exact) {
            if(!path) {
              return false;
            }

            // Remove leading number sign from given path and match with current location
            // Returns true if current locations matches given path
            var regex = '^' + path.replace(/#/g, '');

            // If the exact path has to be match add dollar sign to match for end of line
            if (exact) {
              regex += '$';
            }
            return $location.path().match(new RegExp(regex)) ? true : false;
          };
        }
      };
    })

    .directive('mwNavbarContent', function () {
      return {
        transclude: true,
        replace: true,
        template: '<div class="navbar-collapse collapse" ng-transclude></div>',
        link: function(scope, elm) {
          scope.uncollapse = function() {
            elm.collapse('hide');
          };
        }
      };
    })

    .directive('mwNavbarBrand', function () {
      return {
        transclude: true,
        replace: true,
        templateUrl: 'modules/ui/templates/mwNav/mwNavbarBrand.html'
      };
    })

    .directive('mwNavbarItems', function () {
      return {
        transclude: true,
        replace: true,
        template: '<ul class="nav navbar-nav" ng-transclude></ul>',
        link: function (scope, elm, attr) {

          if(attr.mwNavbarItems) {
            elm.addClass('navbar-' + attr.mwNavbarItems);
          }

          elm.on('click', function () {
            if (elm.hasClass('in')) {
              elm.collapse('hide');
            }
          });
        }
      };
    })

    .directive('mwNavbarItem', function () {
      return {
        transclude: true,
        replace: true,
        require: '^mwNavbar',
        template: '<li ng-class="{ true: \'active\' }[isActive()]" ng-transclude></li>',
        link: function (scope, elm, attr, mwNavbarCtrl) {
          scope.isActive = function () {
            return mwNavbarCtrl.isActive(elm.find('a').attr('href'));
          };

          elm.find('a').on('click', function() {
            scope.uncollapse();
          });
        }
      };
    })

    .directive('mwNavbarDropdown', function () {
      return {
        replace: true,
        require: '^mwNavbar',
        transclude: true,
        template: '<li ng-class="{ true: \'active\' }[isActive()]" class="dropdown" ng-transclude></li>',
        link: function (scope, elm, attr, mwNavbarCtrl) {
          scope.isActive = function () {
            var isActive = false;
            angular.forEach(scope.dropdownItems, function (path) {
              if (!isActive) {
                isActive = mwNavbarCtrl.isActive(path);
              }
            });
            return isActive;
          };
        },
        controller: function ($scope) {
          var dropdownItems = $scope.dropdownItems = [];
          this.register = function (path) {
            dropdownItems.push(path);
          };
        }
      };
    })

    .directive('mwNavbarDropdownTitle', function () {
      return {
        replace: true,
        transclude: true,
        template: '<a class="dropdown-toggle" data-toggle="dropdown"><span ng-transclude></span> <b class="caret"></b></a>'
      };
    })

    .directive('mwNavbarDropdownItems', function () {
      return {
        transclude: true,
        replace: true,
        template: '<ul class="dropdown-menu" ng-transclude></ul>'
      };
    })


    .directive('mwNavbarDropdownItem', function () {
      return {
        transclude: true,
        replace: true,
        require: ['^mwNavbarDropdown', '^mwNavbar'],
        template: '<li ng-class="{ true: \'active\' }[isActive()]" ng-transclude></li>',
        link: function (scope, elm, attr, ctrls) {
          var link = elm.find('a').attr('href'),
              mwNavbarDropdownItemsCtrl = ctrls[0],
              mwNavbarCtrl = ctrls[1];

          mwNavbarDropdownItemsCtrl.register(link);

          scope.isActive = function () {
            return mwNavbarCtrl.isActive(link, true);
          };

          elm.find('a').on('click', function() {
            scope.uncollapse();
          });
        }
      };
    })


;