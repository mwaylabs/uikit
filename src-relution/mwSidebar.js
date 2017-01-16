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
      templateUrl: 'uikit/templates/mwSidebar/mwSidebarSelect.html',
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
  .directive('mwSidebarPanel', function ($document, $window) {
    return {
      replace: true,
      transclude: true,
      templateUrl: 'uikit/templates/mwSidebar/mwSidebarPanel.html',
      link: function (scope, el) {

        var windowEl = angular.element($window);

        var reposition = function () {
          var offsetTop = angular.element(el).offset().top,
            offsetHeaderTop = angular.element('*[mw-header]').offset().top + angular.element('*[mw-header]').height(),
            spacer = 15, //Offset so the sidebar has some whitespce to the header
            newOffset = offsetTop - offsetHeaderTop - spacer,
            scrollTop = $document.scrollTop();

          if(newOffset <= 10 ){
            //There is no element between sidebar and header so we can kill the scroll listener
            windowEl.off('scroll', throttledRepositionFn);
          } else if (scrollTop > newOffset) {
            angular.element(el).find('.content-container').css('top', offsetHeaderTop + spacer);
          } else if (scrollTop > 1) {
            angular.element(el).find('.content-container').css('top', offsetTop - scrollTop);
          } else {
            angular.element(el).find('.content-container').css('top', 'initial');
          }
        };

        var setMaxHeight = function () {
          var containerEl = el.find('.content-container'),
            windowHeight = windowEl.height(),
            containerElOffsetTop = el.offset().top,
            footerHeight = angular.element('body > footer').height(),
            padding = 20,
            maxHeight = windowHeight - containerElOffsetTop - footerHeight - padding;

          if (maxHeight > 0) {
            containerEl.css('max-height', maxHeight);
          } else {
            containerEl.css('max-height', 'initial');
          }
        };

        var throttledRepositionFn = _.throttle(reposition,10),
            throttledSetMaxHeight = _.throttle(setMaxHeight, 500);

        window.requestAnimFrame(setMaxHeight);
        setTimeout(setMaxHeight, 500);

        windowEl.on('resize', throttledSetMaxHeight);
        windowEl.on('scroll', throttledRepositionFn);

        scope.$on('$destroy', function(){
          windowEl.off('resize', throttledSetMaxHeight);
          windowEl.off('scroll', throttledRepositionFn);
        });
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
      scope: {
        title: '@mwTitle'
      },
      templateUrl: 'uikit/templates/mwSidebar/mwSidebarActions.html'
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
      templateUrl: 'uikit/templates/mwSidebar/mwSidebarFilters.html',
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


