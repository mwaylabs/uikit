'use strict';

angular.module('mwFilter', [])

/**
 * @ngdoc directive
 * @name mwFilter.directive:mwFilterSelect
 * @element div
 * @description
 *
 * Creates a select input which provides possible values for a filtering.
 *
 * @param {filterable} filterable Filterable instance.
 * @param {expression} disabled If expression evaluates to true, input is disabled.
 * @param {string} property The name of the property on which the filtering should happen.
 */
    .directive('mwFilterSelect', function () {
      return {
        transclude: true,
        scope: {
          filterable: '=',
          disabled: '=',
          property: '@'
        },
        templateUrl: 'modules/ui/templates/mwFilter/mwFilterSelect.html',
        link: function (scope) {
          scope.model = scope.filterable.properties[scope.property];
        }
      };
    })

/**
 * @ngdoc directive
 * @name mwFilter.directive:mwFilterSearch
 * @element div
 * @description
 *
 * Creates a search field to filter by. Search is triggered on keypress 'enter'.
 *
 * @param {filterable} filterable Filterable instance.
 * @param {expression} disabled If expression evaluates to true, input is disabled.
 * @param {string} property The name of the property on which the filtering should happen.
 */
    .directive('mwFilterSearch', function () {
      return {
        transclude: true,
        scope: {
          filterable: '=',
          disabled: '=',
          property: '@'
        },
        templateUrl: 'modules/ui/templates/mwFilter/mwFilterSearch.html',
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
 * @name mwFilter.directive:mwFilterPanel
 * @element div
 * @description
 *
 * Directive for the filter panel.
 *
 */
    .directive('mwFilterPanel', function () {
      return {
        replace: true,
        transclude: true,
        templateUrl: 'modules/ui/templates/mwFilter/mwFilterPanel.html'
      };
    });

