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
        mwDisabled: '=',
        property: '@',
        persist: '='
      },
      templateUrl: 'modules/ui/templates/mwSidebar/mwSidebarSelect.html',
      link: function (scope) {
        scope.$watch('filterable', function () {
          if (scope.filterable) {
            scope.model = scope.filterable.properties[scope.property];
            if (scope.persist) {
              scope.filterable.properties[scope.property].persist = scope.persist;
            }
          }
        });
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
  .directive('mwSidebarPanel', function ($document, $window, $timeout) {
    return {
      replace: true,
      transclude: true,
      templateUrl: 'modules/ui/templates/mwSidebar/mwSidebarPanel.html',
      link: function (scope, el, attr) {
        var offsetTop = angular.element(el).offset().top,
          newOffset;

        var repos = function () {
          offsetTop = angular.element(el).offset().top;

          if ($document.scrollTop() < attr.offset) {
            newOffset = offsetTop - $document.scrollTop();
          } else {
            newOffset = offsetTop - attr.offset;
          }

          angular.element(el).find('.content-container').css('top', newOffset);

          if ($document.scrollTop() < 1) {
            angular.element(el).find('.content-container').css('top', 'initial');
          }

        };

        var setMaxHeight = function () {
          var containerEl = el.find('.content-container'),
            windowHeight = angular.element(window).height(),
            containerElOffsetTop = containerEl.offset().top,
            footerHeight = angular.element('body > footer').height(),
            padding = 20,
            maxHeight = windowHeight - containerElOffsetTop - footerHeight - padding;

            if(maxHeight>0){
              containerEl.css('max-height', maxHeight);
            } else {
              containerEl.css('max-height', 'initial');
            }
        };


        $timeout(function () {
          setMaxHeight();
        }, 500);

        angular.element($window).on('resize', _.throttle(setMaxHeight, 300));

        if (attr.affix && attr.offset) {
          angular.element($window).scroll(function () {
            repos();
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
      template: '<div ng-transclude></div><hr>'
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
      templateUrl: 'modules/ui/templates/mwSidebar/mwSidebarFilters.html',
      link: function (scope) {
        scope.resetFiltersOnClose = function () {
          if (!scope.toggleFilters) {
            scope.filterable.resetFilters();
            scope.filterable.applyFilters();
          }
        };

        if (scope.filterable && scope.filterable.hasPersistedFilters()) {
          scope.toggleFilters = true;
        }
      }
    };
  });


