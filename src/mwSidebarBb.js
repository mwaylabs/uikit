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
  .directive('mwSidebarFiltersBb', function ($timeout, MCAPFilterHolder) {
    return {
      transclude: true,
      templateUrl: 'uikit/templates/mwSidebarBb/mwSidebarFilters.html',
      controller: function ($scope) {
        this.getCollection = function () {
          return $scope.collection;
        };

        this.getFilterHolders = function () {
          return $scope.filterHolders;
        };

        this.changeFilter = function (property, value, isUrlParam) {
          if (isUrlParam) {
            $scope.collection.filterable.customUrlParams[property] = value;
            $scope.viewModel.tmpFilter.get('customUrlParams')[property] = value;
          } else {
            var filterVal = {};
            filterVal[property] = value;
            $scope.collection.filterable.setFilters(filterVal);
            $scope.viewModel.tmpFilter.set({filter: $scope.collection.filterable.getFilters()});
            $scope.viewModel.tmpFilter.get('filterValues')[property] = value;
          }

          $scope.collection.fetch();

        };
      },
      link: function (scope, el, attr) {

        scope.showFilterForm = scope.$eval(attr.showFilterForm);
        scope.mwListCollection = scope.$eval(attr.mwListCollection);
        scope.collection = scope.$eval(attr.collection);

        if (scope.mwListCollection) {

          var _filterAnimationDuration = 400;

          scope.collection = scope.mwListCollection.getCollection();
          scope.mwListCollectionFilter = scope.mwListCollection.getMwListCollectionFilter();
          scope.filters = scope.mwListCollectionFilter.getFilters();
          scope.appliedFilter = scope.mwListCollectionFilter.getAppliedFilter();

          scope.viewModel = {
            tmpFilter: new MCAPFilterHolder(),
            showFilterForm: false,
            canShowForm: false
          };

          if(scope.showFilterForm){
            scope.viewModel.showFilterForm = true;
          }

          var setTotalAmount = function (filterModel) {
            var filterModelInCollection = scope.filters.get(filterModel),
              totalAmount = scope.collection.filterable.getTotalAmount();

            filterModel.set('totalAmount', totalAmount);
            if (filterModelInCollection) {
              filterModelInCollection.set('totalAmount', totalAmount);
            }
          };

          var filterCollection = function (filterModel) {
            scope.collection.filterable.resetFilters();
            scope.collection.filterable.setFilters(filterModel.get('filterValues'));
            return scope.collection.fetch().then(function () {
              setTotalAmount(filterModel);
            });
          };

          scope.saveFilter = function () {
            var filter;
            if (scope.viewModel.tmpFilter.isNew()) {
              filter = new MCAPFilterHolder(scope.viewModel.tmpFilter.toJSON());
            } else {
              filter = scope.viewModel.tmpFilter;
            }
            scope.mwListCollectionFilter.saveFilter(filter).then(function (filterModel) {
              scope.viewModel.showFilterForm = false;
              scope.applyFilter(filterModel);
            });

          };

          scope.deleteFilter = function (filterModel) {
            var removeId = filterModel.id,
              appliedId = scope.appliedFilter.id;

            return scope.mwListCollectionFilter.deleteFilter(filterModel).then(function () {

              if (removeId === appliedId) {
                scope.revokeFilter();
              }
            });
          };

          scope.applyFilter = function (filterModel) {
            filterCollection(filterModel).then(function () {
              scope.mwListCollectionFilter.applyFilter(filterModel);
            });
          };

          scope.revokeFilter = function () {
            scope.mwListCollectionFilter.revokeFilter().then(function () {
              scope.collection.filterable.resetFilters();
              scope.collection.fetch();
              scope.appliedFilter.clear();
            });
          };

          scope.addFilter = function () {
            var emptyFilter = new MCAPFilterHolder();

            scope.viewModel.canShowForm = true;
            scope.viewModel.tmpFilter.clear();
            scope.viewModel.tmpFilter.set(emptyFilter.toJSON());
            scope.viewModel.showFilterForm = true;
            $timeout(function () {
              filterCollection(scope.viewModel.tmpFilter);
            }, _filterAnimationDuration);
          };

          scope.editFilter = function (filterModel) {
            scope.viewModel.canShowForm = true;
            scope.viewModel.tmpFilter.clear();
            scope.viewModel.tmpFilter.set(filterModel.toJSON());
            scope.viewModel.showFilterForm = true;
            $timeout(function () {
              filterCollection(filterModel);
            }, _filterAnimationDuration);
          };

          scope.cancelFilterEdit = function () {
            scope.viewModel.showFilterForm = false;
            if (!scope.appliedFilter.id || scope.appliedFilter.id !== scope.viewModel.tmpFilter.id) {
              $timeout(function () {
                scope.applyFilter(scope.appliedFilter);
              }, _filterAnimationDuration);
            }
          };

          scope.filtersAreApplied = function () {
            return (_.size(scope.viewModel.tmpFilter.get('filterValues')) > 0);
          };

          scope.mwListCollectionFilter.fetchFilters();
          scope.mwListCollectionFilter.fetchAppliedFilter().then(function (filterModel) {
            setTotalAmount(filterModel);
          });

        } else if (scope.collection) {
          // TODO ADD OLD IMPLEMENTATION
          console.warn('The scope attribute collection is deprecated please use the mwCollection instead');
          scope.viewModel = {
            showFilterForm: true,
            canShowForm: true,
            tmpFilter: new MCAPFilterHolder()
          };
        } else {
          throw new Error('please pass a collection or mwCollection as scope attribute');
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
      link: function (scope, elm, attr, mwSidebarFiltersBbCtrl) {

        scope.viewModel = {};

        //set key function for select key
        scope.key = function (model) {
          if (angular.isDefined(scope.keyProperty)) {
            return model.attributes[scope.keyProperty];
          } else {
            return model.attributes.key;
          }
        };

        scope.collection = mwSidebarFiltersBbCtrl.getCollection();

        //set label function fo select label
        scope.label = function (model) {
          //translate with i18n service if translationPrefix is defined
          var label = scope.key(model);
          if (scope.translationPrefix && scope.translationSuffix) {
            label = i18n.get(scope.translationPrefix + '.' + scope.key(model) + '.' + scope.translationSuffix);
          } else if (scope.translationSuffix) {
            label = i18n.get(scope.key(model) + '.' + scope.translationSuffix);
          } else if (scope.translationPrefix) {
            label = i18n.get(scope.translationPrefix + '.' + scope.key(model));
          }
          return label;
        };

        scope.changed = function () {
          var property = scope.customUrlParameter ? scope.customUrlParameter : scope.property;
          mwSidebarFiltersBbCtrl.changeFilter(property, scope.viewModel.val, !!scope.customUrlParameter);
        };

        if (angular.isDefined(scope.labelProperty)) {
          scope.label = function (model) {
            //translate if value is a translation object
            if (angular.isObject(model.attributes[scope.labelProperty])) {
              return i18n.localize(model.attributes[scope.labelProperty]);
            }
            return model.attributes[scope.labelProperty];
          };
        }

        if (angular.isDefined(scope.labelTransformFn)) {
          scope.label = scope.labelTransformFn;
        }

        scope.$watch('collection.filterable.filterValues.' + scope.property, function (val) {
          if (val && val.length > 0) {
            scope.viewModel.val = val;
          } else {
            scope.viewModel.val = null;
          }
        });
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

  .directive('mwSidebarInputBb', function () {
    return {
      require: '^mwSidebarFiltersBb',
      scope: {
        type: '@',
        property: '@',
        placeholder: '@',
        mwDisabled: '=',
        customUrlParameter: '@'
      },
      templateUrl: 'uikit/templates/mwSidebarBb/mwSidebarInput.html',
      link: function (scope, elm, attr, ctrl) {

        scope.viewModel = {};

        scope._type = scope.type || 'text';

        scope.isValid = function () {
          return elm.find('input').first().hasClass('ng-valid');
        };

        scope.changed = function () {
          var property = scope.customUrlParameter ? scope.customUrlParameter : scope.property;
          ctrl.changeFilter(property, scope.viewModel.val, !!scope.customUrlParameter);
        };
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

  .directive('mwSidebarNumberInputBb', function () {
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

        scope.isValid = function () {
          return elm.find('input').first().hasClass('ng-valid');
        };

        scope.changed = function () {
          var property = scope.customUrlParameter ? scope.customUrlParameter : scope.property;
          console.log(property, scope.viewModel.val);
          ctrl.changeFilter(property, scope.viewModel.val, !!scope.customUrlParameter);
        };
      }
    };
  });


