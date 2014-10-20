'use strict';

angular.module('mwComponentsBb', [])

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwFilterableSearch
 * @element div
 * @description
 *
 * Creates a search field to filter by in the sidebar. Search is triggered on keypress 'enter'.
 *
 * @param {filterable} filterable Filterable instance.
 * @param {expression} disabled If expression evaluates to true, input is disabled.
 * @param {string} property The name of the property on which the filtering should happen.
 */
  .directive('mwFilterableSearchBb', function ($timeout, Loading, Detect, EmptyState) {
    return {
      transclude: true,
      scope: {
        collection: '=',
        property: '@',
        customUrlParameter: '@',
        mwDisabled: '='
      },
      templateUrl: 'modules/ui/templates/mwComponentsBb/mwFilterableSearch.html',
      link: function (scope) {

        scope.inputLength = 0;
        scope.isMobile = Detect.isMobile();

        var timeout;

        var search = function () {
          //set property to setted filters on collection
          var property = scope.customUrlParameter ? scope.customUrlParameter : scope.property;
          EmptyState.pushFilter(scope.collection, property);

          //backup searched text to reset after fetch complete in case of search text was empty
          var searchText = scope.customUrlParameter ? scope.collection.filterable.customUrlParams[scope.customUrlParameter] : scope.collection.filterable.filterValues[scope.property];
          return scope.collection.fetch().then(function(collection){
            if(searchText === ''){
              EmptyState.removeFilter(collection, property);
            }
          });
        };

        var throttler = function () {
          scope.searching = true;

          $timeout.cancel(timeout);

          timeout = $timeout(function () {
            search().then(function () {
              $timeout.cancel(timeout);
              scope.searching = false;
            }, function () {
              scope.searching = false;
            });
          }, 500);
        };

        scope.search = function (event) {
          if (!event || event.keyCode === 13) {
            search();
          } else {

            if(!scope.isMobile){
              throttler();
            }
          }
        };

        scope.reset = function () {
          if(scope.customUrlParameter) {
            scope.collection.filterable.customUrlParams[scope.customUrlParameter] = '';
          } else {
            scope.collection.filterable.filterValues[scope.property] = '';
          }
        };

        scope.hideSearchIcon = function() {
          if(!scope.collection){
            return false;
          }
          var filterable = scope.collection.filterable;
          if(scope.searching || scope.isMobile) {
            return true;
          }
          return scope.customUrlParameter ? filterable.customUrlParams[scope.customUrlParameter].length > 0 : filterable.filterValues[scope.property].length > 0;
        };

        scope.showResetIcon = function() {
          if(!scope.collection || scope.isMobile){
            return false;
          }
          if(scope.customUrlParameter){
            return scope.collection.filterable.customUrlParams[scope.customUrlParameter].length > 0 && !scope.searching;
          } else {
            return scope.collection.filterable.filterValues[scope.property].length > 0 && !scope.searching;
          }
        };

//        Loading.registerDoneCallback(function(){
//          scope.loading = false;
//        });
//
//        scope.loading = Loading.isLoading();
      }
    };
  })

  .directive('mwEmptyStateBb', function (EmptyState) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        collection: '=',
        text: '@mwEmptyStateBb'
      },
      transclude: true,
      templateUrl: 'modules/ui/templates/mwComponentsBb/mwEmptyStateBb.html',
      link: function(scope){
        scope.showEmptyState = function(){
          return scope.collection.length === 0 && !EmptyState.hasFilters(scope.collection);
        };
      }
    };
  })
;




