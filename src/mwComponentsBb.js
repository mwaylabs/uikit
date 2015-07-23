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
  .directive('mwFilterableSearchBb', function ($timeout, $animate, Loading, Detect, EmptyState, Persistance) {
    return {
      scope: {
        collection: '=',
        property: '@',
        customUrlParameter: '@',
        mwDisabled: '='
      },
      templateUrl: 'modules/ui/templates/mwComponentsBb/mwFilterableSearch.html',
      link: function (scope, elm) {
        $animate.enabled(false, elm.find('.search-indicator'));

        scope.inputLength = 0;
        var timeout,
            isMobile = Detect.isMobile();

        var getSearchText = function(){
          return scope.customUrlParameter ? scope.collection.filterable.customUrlParams[scope.customUrlParameter] : scope.collection.filterable.filterValues[scope.property];
        };

        var search = function () {
          //show search icon
          scope.searching = true;

          //persist filter values
          Persistance.saveFilterValues(scope.collection);

          //set property to setted filters on collection
          var property = scope.customUrlParameter ? scope.customUrlParameter : scope.property;
          EmptyState.pushFilter(scope.collection, property);

          //backup searched text to reset after fetch complete in case of search text was empty
          return scope.collection.fetch()
              .then(function(collection){
                if(getSearchText() === ''){
                  EmptyState.removeFilter(collection, property);
                }
              }).finally(function(){
                scope.searching = false;
              });
        };

        var throttler = function () {
          $timeout.cancel(timeout);
          timeout = $timeout(function () {
            search().then(function () {
              $timeout.cancel(timeout);
            });
          }, 500);
        };

        scope.search = function (event) {
          if (!event || event.keyCode === 13) {
            search();
          } else {

            if(!isMobile){
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

        scope.showResetIcon = function() {
          //never show icon on mobile
          if(!scope.collection || isMobile){
            return false;
          }
          //return true if search text is undefined (ng-model is invalid e..g text is too long)
          if(angular.isUndefined(getSearchText())){
            return true;
          }
          //show icon when searchText is there
          return getSearchText().length > 0;
        };

        scope.performAction = function(){
          if(scope.showResetIcon() && !scope.searching) {
            scope.reset();
          }
          scope.search();
        };
      }
    };
  })

  .directive('mwEmptyStateBb', function (EmptyState) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        collection: '=',
        text: '@mwEmptyStateBb',
        button: '&',
        buttonText: '@'
      },
      transclude: true,
      templateUrl: 'modules/ui/templates/mwComponentsBb/mwEmptyStateBb.html',
      link: function(scope){
        scope.showEmptyState = function(){
          return !scope.collection || (scope.collection.length === 0 && !EmptyState.hasFilters(scope.collection));
        };
      }
    };
  })


  .directive('mwVersionSelector', function(){
    return {
      restrict: 'A',
      scope: {
        currentVersionModel: '=',
        versionCollection: '=',
        versionNumberKey: '@',
        url: '@'
      },
      templateUrl: 'modules/ui/templates/mwComponentsBb/mwVersionSelector.html',
      link: function(scope){
        scope.versionNumberKey = scope.versionNumberKey || 'versionNumber';
        scope.getUrl = function(uuid){
          return scope.url.replace('VERSION_UUID', uuid);
        };
      }
    };
  });




