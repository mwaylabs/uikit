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
 * @param {collection} collection with option models. by default model.key() and model.label() functions will be called as key label
 * @param {expression} mwDisabled If expression evaluates to true, input is disabled.
 * @param {string} property The name of the property on which the filtering should happen.
 * @param {string} placeholder The name of the default selected label with an empty value.
 * @param {expression} persist If true, filter will be saved in runtime variable
 * @param {string} keyProperty property of model to use instead of models key() method
 * @param {string | object} labelProperty property of model to use instead of models label() method. if object it will be translated with i18n service.
 * @param {function} labelTransformFn function to use instead of label() method or labelProperty. Will be called with model as parameter.
 * @param {string} translatePrefix prefix to translate the label with i18n service (prefix + '.' + model.key()).
 */
  .directive('mwSidebarSelectBb', function (i18n) {
    return {
      require: '^mwSidebarFiltersBb',
      scope: {
        property: '@',
        options: '=',
        placeholder: '@',
        mwDisabled: '=',
        persist: '=',
        keyProperty: '@',
        labelProperty: '@',
        labelTransformFn: '=',
        translatePrefix: '@',
        customUrlParameter: '@'
      },
      templateUrl: 'modules/ui/templates/mwSidebarBb/mwSidebarSelect.html',
      link: function (scope, elm, attr, ctrl) {

        //set key function for select key
        scope.key = function(model) {
          return model.key();
        };

        if(angular.isDefined(scope.keyProperty)) {
          scope.key = function(model) {
            return model.attributes[scope.keyProperty];
          };
        }

        //set label function fo select label
        scope.label = function(model){
          //translate with i18n service if translatePrefix is defined (use key not label!)
          if(scope.translatePrefix){
            return i18n.get(scope.translatePrefix + '.' + model.key());
          }
          return model.label();
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

        //TODO implement filter persistance
        /*scope.$watch('filterable', function () {
          if (scope.filterable) {
            scope.model = scope.filterable.properties[scope.property];
            if (scope.persist) {
              scope.filterable.properties[scope.property].persist = scope.persist;
            }
          }
        });*/
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
  .directive('mwSidebarFiltersBb', function () {
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
            scope.collection.fetch();
          }
        };

        /*if (scope.collection.hasPersistedFilters()) {
          scope.toggleFilters = true;
        }*/
      },
      controller: function($scope){
        this.getCollection = function(){
          return $scope.collection;
        };
      }
    };
  });


