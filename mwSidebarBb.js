'use strict';

angular.module('mwSidebarBb', [])

/**
 * @ngdoc directive
 * @name mwSidebar.directive:mwSidebarSelect
 * @element div
 * @description
 *
 * Creates a select input which provides possible values for a filtering.
 *
 * label: as default model.attributes.key will be used. If one of the following is specified it will be used. If two or more are specified the one which stands higher will be used:
 * - labelTransformFn
 * - labelProperty
 * - translationPrefix
 *
 * @param {collection} collection with option models. by default model.attributes.key will be called as key label
 * @param {expression} mwDisabled If expression evaluates to true, input is disabled.
 * @param {string} property The name of the property on which the filtering should happen.
 * @param {string} placeholder The name of the default selected label with an empty value.
 * @param {expression} persist If true, filter will be saved in runtime variable
 * @param {string} keyProperty property of model to use instead of models.attribute.key property
 * @param {string | object} labelProperty property of model to use instead of model.attributes.key poperty. If it is an object it will be translated with i18n service.
 * @param {function} labelTransformFn function to use. Will be called with model as parameter.
 * @param {string} translationPrefix prefix to translate the label with i18n service (prefix + '.' + model.attributes.key).
 */
  .directive('mwSidebarSelectBb', function (i18n, Persistance, EmptyState) {
    return {
      require: '^mwSidebarFiltersBb',
      scope: {
        property: '@',
        options: '=',
        placeholder: '@',
        mwDisabled: '=',
        keyProperty: '@',
        labelProperty: '@',
        labelTransformFn: '=',
        translationPrefix: '@',
        customUrlParameter: '@'
      },
      templateUrl: 'modules/ui/templates/mwSidebarBb/mwSidebarSelect.html',
      link: function (scope, elm, attr, ctrl) {

        //set key function for select key
        scope.key = function(model) {
          return model.attributes.key;
        };

        if(angular.isDefined(scope.keyProperty)) {
          scope.key = function(model) {
            return model.attributes[scope.keyProperty];
          };
        }

        //set label function fo select label
        scope.label = function(model){
          //translate with i18n service if translationPrefix is defined
          if(scope.translationPrefix){
            return i18n.get(scope.translationPrefix + '.' + scope.key(model));
          }
          return scope.key(model);
        };

        if(angular.isDefined(scope.labelProperty)){
          scope.label = function(model){
            //translate if value is a translation object
            if(angular.isObject(model.attributes[scope.labelProperty])){
              return i18n.localize(model.attributes[scope.labelProperty]);
            }
            return model.attributes[scope.labelProperty];
          };
        }

        if(angular.isDefined(scope.labelTransformFn)){
          scope.label = scope.labelTransformFn;
        }

        scope.collection = ctrl.getCollection();

        scope.changed = function(){
          //add property to setted filters on collection for empty state
          var property = scope.customUrlParameter ? scope.customUrlParameter : scope.property;
          EmptyState.pushFilter(scope.collection, property);

          //persist filter values
          Persistance.saveFilterValues(scope.collection);

          //fetch data and reset filtered property for this selectbox if the filter value or customUrlParameter is empty
          var searchValue = scope.customUrlParameter ? scope.collection.filterable.customUrlParams[scope.customUrlParameter] : scope.collection.filterable.filterValues[scope.property];
          scope.collection.fetch().then(function(collection){
            if(!searchValue){
              EmptyState.removeFilter(collection, property);
            }
          });
        };
      }
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
  .directive('mwSidebarFiltersBb', function (Persistance, EmptyState) {
    return {
      transclude: true,
      templateUrl: 'modules/ui/templates/mwSidebarBb/mwSidebarFilters.html',
      link: function (scope, elm, attr) {

        scope.collection = scope.$eval(attr.collection);
        if(!angular.isDefined(scope.collection)){
          throw new Error('mwSidebarFiltersBb does not have a collection!');
        }

        scope.resetFiltersOnClose = function () {
          if (!scope.toggleFilters) {
            scope.collection.filterable.resetFilters();
            Persistance.clearFilterValues(scope.collection);
            scope.collection.fetch().then(function(collection){
              EmptyState.resetFilter(collection);
            });
          }
        };

        //open filters when there are persisted filters saved
        if(Persistance.getFilterValues(scope.collection)){
          scope.toggleFilters = true;
        }
      },
      controller: function($scope){
        this.getCollection = function(){
          return $scope.collection;
        };
      }
    };
  });


