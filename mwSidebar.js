'use strict';

angular.module('mwSidebar', [])

/**
 * @ngdoc directive
 * @name mwSidebar.directive:mwSidebarSelect
 * @element div
 * @description
 *
 * Creates a select input which provides possible values for a filtering.
 *
 * @param {filterable} filterable Filterable instance.
 * @param {expression} disabled If expression evaluates to true, input is disabled.
 * @param {string} property The name of the property on which the filtering should happen.
 */
    .directive('mwSidebarSelect', function () {
      return {
        transclude: true,
        scope: {
          filterable: '=',
          disabled: '=',
          property: '@'
        },
        templateUrl: 'modules/ui/templates/mwSidebar/mwSidebarSelect.html',
        link: function (scope) {
          scope.$watch('filterable', function () {
            if (scope.filterable) {
              scope.model = scope.filterable.properties[scope.property];
            }
          });
        }
      };
    })

/**
 * @ngdoc directive
 * @name mwSidebar.directive:mwSidebarSearch
 * @element div
 * @description
 *
 * Creates a search field to filter by in the sidebar. Search is triggered on keypress 'enter'.
 *
 * @param {filterable} filterable Filterable instance.
 * @param {expression} disabled If expression evaluates to true, input is disabled.
 * @param {string} property The name of the property on which the filtering should happen.
 */
    .directive('mwSidebarSearch', function () {
      return {
        transclude: true,
        scope: {
          filterable: '=',
          disabled: '=',
          property: '@'
        },
        templateUrl: 'modules/ui/templates/mwSidebar/mwSidebarSearch.html',
        link: function (scope) {
          scope.model = scope.filterable.properties[scope.property];

          scope.search = function (event) {
            if (event === null || event.keyCode === 13) {
              scope.filterable.applyFilters();
            }
          };
        }
      };
    })

/**
 * @ngdoc directive
 * @name mwSidebar.directive:mwSidebarPanel
 * @element div
 * @description
 *
 * Directive for the filter panel.
 *
 * @param {boolean} affix Make the filterbar affix by listening on window scroll event and changing top position so that the filterbar can be postion relative instead of fixed
 * @param {number} offset If needed an offset to the top for example when a nav bar is over the sidebar that is not fixed.
 *
 */
    .directive('mwSidebarPanel', function ($document, $window) {
      return {
        replace: true,
        transclude: true,
        templateUrl: 'modules/ui/templates/mwSidebar/mwSidebarPanel.html',
        link: function (scope, el, attr) {
          console.log(scope.filterable);

          var offsetTop = angular.element(el).offset().top;

          var repositionFilterPanel = function () {
            var scrollPos = $document.scrollTop(),
                newPos = scrollPos - offsetTop - (attr.offset * -1);
            newPos = newPos > 0 ? newPos : 0;
            if (newPos < 0) {
              newPos = 0;
              el.removeClass('affixed');
            }
            el.addClass('affixed');
            el.css('top', newPos);
          };

          if (attr.affix) {
            angular.element($window).scroll(function () {
              repositionFilterPanel();
            });
          }
        }
      };
    })

/**
 * @ngdoc directive
 * @name mwSidebar.directive:mwSidebarActions
 * @element div
 * @description
 *
 * Container for actions
 *
 */
    .directive('mwSidebarActions', function () {
      return {
        transclude: true,
        template: '<div ng-transclude></div>'
      };
    })

/**
 * @ngdoc directive
 * @name mwSidebar.directive:mwSidebarFilters
 * @element div
 * @description
 *
 * Container for filters
 *
 */
    .directive('mwSidebarFilters', function () {
      return {
        transclude: true,
        templateUrl: 'modules/ui/templates/mwSidebar/mwSidebarFilters.html'
      };
    });


