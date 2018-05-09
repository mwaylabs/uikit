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
  .directive('mwSidebarFiltersBb', function ($timeout, FilterHolderModel, InvalidFilterModal) {
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
            $scope.viewModel.tmpFilter.set({ filter: $scope.collection.filterable.getFilters() });
            $scope.viewModel.tmpFilter.get('filterValues')[property] = value;
          }

          $scope.collection.fetch();
        };
      },
      link: function (scope, el, attr) {

        scope.showFilterForm = scope.$eval(attr.showFilterForm);
        scope.mwListCollection = scope.$eval(attr.mwListCollection);
        scope.collection = scope.$eval(attr.collection);
        scope.isLoading = false;

        if (scope.mwListCollection) {

          var _filterAnimationDuration = 400;

          scope.collection = scope.mwListCollection.getCollection();
          scope.mwListCollectionFilter = scope.mwListCollection.getMwListCollectionFilter();
          scope.filters = scope.mwListCollectionFilter.getFilters();
          scope.appliedFilter = scope.mwListCollectionFilter.getAppliedFilter();

          scope.viewModel = {
            tmpFilter: new FilterHolderModel(),
            showFilterForm: false,
            canShowForm: false
          };

          if (scope.showFilterForm) {
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
            return scope.mwListCollectionFilter.fetchAppliedSearchTerm().then(function (searchTerm) {
              if (searchTerm.val) {
                var searchTermFilter = {};
                searchTermFilter[searchTerm.attr] = searchTerm.val;
                scope.collection.filterable.setFilters(searchTermFilter);
              }
              return scope.collection.fetch().then(function () {
                setTotalAmount(filterModel);
              });
            });
          };

          var removeInvalidFilterKeys = function (filterModel, invalidFilterKeys) {
            var filterValues = filterModel.get('filterValues');

            invalidFilterKeys.forEach(function (invalidFilterKey) {
              delete filterValues[invalidFilterKey];
            });

            return filterModel;
          };

          scope.isFilterApplied = function (filter) {
            var appliedFilter = scope.mwListCollectionFilter.getAppliedFilter();
            if (filter) {
              return appliedFilter.id === filter.id;
            }
          };

          scope.saveFilter = function () {
            var filter;
            if (scope.viewModel.tmpFilter.isNew()) {
              filter = new FilterHolderModel(scope.viewModel.tmpFilter.toJSON());
            } else {
              filter = scope.viewModel.tmpFilter;
            }
            scope.mwListCollectionFilter.saveFilter(filter).then(function (filterModel) {
              scope.viewModel.showFilterForm = false;
              filterModel = scope.filters.get(filter);
              filterModel.set('invalid', false);
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
            var invalidFilterKeys = scope.collection.filterable.getInvalidFilterKeys(filterModel.get('filterValues'));

            if (!filterModel.get('invalid')) {
              filterCollection(filterModel);
              scope.mwListCollectionFilter.applyFilter(filterModel);
            } else {
              var invalidFilterModal = new InvalidFilterModal();
              invalidFilterModal.setScopeAttributes({
                filterModel: filterModel,
                modifyAction: function () {
                  $timeout(function () {
                    scope.editFilter(filterModel);
                  });
                }
              });
              invalidFilterModal.show();
            }
          };

          scope.revokeFilter = function () {
            scope.mwListCollectionFilter.revokeFilter().then(function () {
              scope.collection.filterable.resetFilters();
              scope.collection.fetch();
              scope.appliedFilter.clear();
            });
          };

          scope.addFilter = function () {
            var emptyFilter = new FilterHolderModel();

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

          scope.mwListCollectionFilter.fetchFilters().then(function (mwListCollectionFilter) {
            mwListCollectionFilter.each(function (filterModel) {
              var invalidFilterKeys = scope.collection.filterable.getInvalidFilterKeys(filterModel.get('filterValues'));
              if (invalidFilterKeys.length > 0) {
                filterModel.set('invalid', true);
                removeInvalidFilterKeys(filterModel, invalidFilterKeys);
              }
            });
          });
          scope.mwListCollectionFilter.fetchAppliedFilter().then(function (filterModel) {
            setTotalAmount(filterModel);
          });
        } else if (scope.collection) {
          // TODO ADD OLD IMPLEMENTATION
          console.warn('The scope attribute collection is deprecated please use the mwCollection instead');
          scope.viewModel = {
            showFilterForm: true,
            canShowForm: true,
            tmpFilter: new FilterHolderModel()
          };
        } else {
          throw new Error('please pass a collection or mwCollection as scope attribute');
        }

        scope.collection.on('request', function () {
          scope.isLoading = true;
        });
        scope.collection.on('sync error remove', function () {
          scope.isLoading = false;
        });
      }
    };
  })

  .factory('InvalidFilterModal', function (Modal) {
    return Modal.prepare({
      templateUrl: 'uikit/templates/mwSidebarBb/mwInvalidFilterModal.html',
      controller: 'InvalidFilterModalController',
      dismissible: false
    });
  })

  .controller('InvalidFilterModalController', function ($scope) {
    $scope.modify = function () {
      if (typeof $scope.modifyAction === 'function') {
        $scope.modifyAction();
        $scope.hideModal();
      } else {
        throw new Error('[InvalidFilterModal] modifyAction has to be a function. Set callback function via modal.setScopeAttributes({modifyAction:...}');
      }
    };

    // User really wants to navigate to that page which was saved before in a temp variable
    $scope.delete = function () {
      if ($scope.filterModel) {
        $scope.filterModel.destroy();
        $scope.hideModal();
      } else {
        throw new Error('[InvalidFilterModal] The scope attribute filterModel has to be a valid filterModel. Set it via modal.setScopeAttributes({filterModel:...})');
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
      link: function (scope, elm, attr, mwSidebarFiltersBbCtrl) {

        scope.viewModel = {};

        scope._type = scope.type || 'text';

        scope.collection = mwSidebarFiltersBbCtrl.getCollection();

        scope.isValid = function () {
          return elm.find('input').first().hasClass('ng-valid');
        };

        scope.changed = function () {
          var property = scope.customUrlParameter ? scope.customUrlParameter : scope.property;
          mwSidebarFiltersBbCtrl.changeFilter(property, scope.viewModel.val, !!scope.customUrlParameter);
        };

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
          ctrl.changeFilter(property, scope.viewModel.val, !!scope.customUrlParameter);
        };
      }
    };
  })

  .directive('mwSidebarDateRangeBb', function ($timeout, $rootScope, i18n) {
    return {
      require: '^mwSidebarFiltersBb',
      scope: {
        fromProperty: '@',
        toProperty: '@',
        mwDisabled: '=',
        customUrlParameter: '@',
        min: '@',
        max: '@'
      },
      templateUrl: 'uikit/templates/mwSidebarBb/mwSidebarDateRange.html',
      link: function (scope, elm, attr, ctrl) {
        var _datePicker;
        scope.isValid = function () {
          return elm.find('input').first().hasClass('ng-valid');
        };

        scope.setFromDate = function (val) {
          scope.viewModel.oldFrom = val;
          ctrl.changeFilter(scope.fromProperty, val);
        };

        scope.setToDate = function (val) {
          scope.viewModel.oldTo = val;
          ctrl.changeFilter(scope.toProperty, val);
        };

        scope.viewModel = {
          oldFrom: null,
          oldTo: null
        }
        var _defaultDatePickerOptions = {
          inputs: elm.find('.actualrange'),
          clearBtn: true,
          format: 'dd.mm.yyyy',
          endDate: scope.max,
          startDate: scope.min
        }
        var updateMwModel = function (datepicker) {
          if (isFinite(datepicker.dates[0]) && isFinite(datepicker.dates[1])) {
            if (scope.oldFrom === null || scope.viewModel.oldFrom.toUTCString() !== datepicker.dates[0].toUTCString()) {
              scope.setFromDate(datepicker.dates[0]);
              $timeout(function () {
                elm.find('.actualrange')[1].focus();
              });
            } else {
              scope.setToDate(datepicker.dates[1]);

              $timeout(function () {
                elm.find('.actualrange').first().focus();
              });
            }
          } else if (isFinite(datepicker.dates[0])) {
            scope.setFromDate(datepicker.dates[0]);
            $timeout(function () {
              elm.find('.actualrange')[1].focus();
            });
          } else if (isFinite(datepicker.dates[1])) {
            scope.setToDate(datepicker.dates[1]);

            $timeout(function () {
              elm.find('.actualrange').first().focus();
            });
          }
        }
        var bindChangeListener = function (datepicker) {
          datepicker.on('changeDate', updateMwModel.bind(this, datepicker.data().datepicker));
          datepicker.on('show', function () {
            $timeout(function () {
              scope.viewModel.datepickerIsOpened = true;
            });
          });
          datepicker.on('hide', function () {
            $timeout(function () {
              scope.viewModel.datepickerIsOpened = false;
            });
          });
        };

        var checkIfDatepickerLibIsAvailable = function (datePickerEl) {
          if (!datePickerEl.datepicker) {
            throw new Error('bootstrap-sass-datepicker is not available. Make sure you included the javascript file');
          }
        };

        var setDatepicker = function (options) {
          var datePickerEl;

          if (_datePicker && _datePicker.data().datepicker) {
            _datePicker.data().datepicker.remove();
          }

          datePickerEl = elm.find('.input-daterange');
          checkIfDatepickerLibIsAvailable(datePickerEl);
          _datePicker = datePickerEl.datepicker(_.extend(_defaultDatePickerOptions, options));
          bindChangeListener(_datePicker);
        };
        setDatepicker();
      }
    };
  });


