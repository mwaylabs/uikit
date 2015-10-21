'use strict';

angular.module('mwSidebarBb', [])

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
      templateUrl: 'uikit/templates/mwSidebarBb/mwSidebarFilters.html',
      controller: function($scope){
        this.getCollection = function(){
          return $scope.collection;
        };

        this.changeFilter = function(property, value, isUrlParam){
          if(isUrlParam){
            $scope.collection.customUrlParams[property] = value;
          } else {
            var filterVal = {};
            filterVal[property] = value;
            $scope.collection.filterable.setFilters(filterVal);
          }

          EmptyState.pushFilter($scope.collection, property);

          //persist filter values
          Persistance.saveFilterValues($scope.collection);

          $scope.collection.fetch();

        }
      },
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
      }
    };
  })

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
  .directive('mwSidebarSelectBb', function (i18n) {
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
        translationSuffix: '@',
        customUrlParameter: '@'
      },
      templateUrl: 'uikit/templates/mwSidebarBb/mwSidebarSelect.html',
      link: function (scope, elm, attr, ctrl) {

        scope.viewModel = {};

        //set key function for select key
        scope.key = function(model) {
          if(angular.isDefined(scope.keyProperty)){
            return model.attributes[scope.keyProperty];
          } else {
            return model.attributes.key;
          }
        };

        //set label function fo select label
        scope.label = function(model){
          //translate with i18n service if translationPrefix is defined
          var label = scope.key(model);
          if(scope.translationPrefix && scope.translationSuffix){
            label = i18n.get(scope.translationPrefix + '.' + scope.key(model) + '.'+scope.translationSuffix);
          } else if(scope.translationSuffix){
            label = i18n.get(scope.key(model)+'.'+scope.translationSuffix);
          } else if(scope.translationPrefix){
            label = i18n.get(scope.translationPrefix + '.' + scope.key(model));
          }
          return label;
        };

        scope.changed = function(){
          var property = scope.customUrlParameter ? scope.customUrlParameter : scope.property;
          ctrl.changeFilter(property, scope.viewModel.val, !!scope.customUrlParameter );
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
      }
    };
  })


/**
 * @ngdoc directive
 * @name mwSidebar.directive:mwSidebarNumberInputBb
 * @element div
 * @description
 *
 * Creates a number input to filter for integer values.
 *
 * @param {expression} mwDisabled If expression evaluates to true, input is disabled.
 * @param {string} property The name of the property on which the filtering should happen.
 * @param {string} placeholder The name of the default selected label with an empty value.
 * @param {expression} persist If true, filter will be saved in runtime variable
 * @param {string} customUrlParameter If set, the filter will be set as a custom url parameter in the collection's filterable
 */

  .directive('mwSidebarNumberInputBb', function (Persistance, EmptyState) {
    return {
      require: '^mwSidebarFiltersBb',
      scope: {
        property: '@',
        placeholder: '@',
        mwDisabled: '=',
        customUrlParameter: '@',
        min: '@',
        max: '@'
      },
      templateUrl: 'uikit/templates/mwSidebarBb/mwSidebarNumberInput.html',
      link: function (scope, elm, attr, ctrl) {

        scope.viewModel = {};

        scope.isValid = function(){
          return elm.find('input').first().hasClass('ng-valid');
        };

        scope.changed = function(){
          var property = scope.customUrlParameter ? scope.customUrlParameter : scope.property;
          ctrl.changeFilter(property, scope.viewModel.val, !!scope.customUrlParameter );
        };
      }
    };
  });


