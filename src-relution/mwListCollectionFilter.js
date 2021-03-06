angular.module('mwCollection')

  .service('MwListCollectionFilter', function ($q,
                                               $rootScope,
                                               $location,
                                               $route,
                                               mwUrlStorage,
                                               mwRuntimeStorage,
                                               FilterHoldersCollection,
                                               FilterHolderProvider) {

    var Filter = function (type) {

      var _type = type,
        _localFilterIdentifier = 'applied_filter_' + _type,
        _localSortOrderIdentifier = 'applied_sort_order_' + _type,
        _localSearchIdentifier = 'applied_search_' + _type,
        _filterHolders = new FilterHoldersCollection(null, type),
        _appliedFilter = FilterHolderProvider.createFilterHolder(),
        _appliedSearchTerm = {
          attr: null,
          val: null
        },
        _appliedSortOrder = {
          order: null,
          property: null
        };

      var setUrlQueryParams = function () {
        var searchFilter = {};

        if (!_appliedFilter.isNew()) {
          searchFilter.f = _appliedFilter.id;
        } else {
          searchFilter.f = null;
        }

        if (_appliedSearchTerm.val && _appliedSearchTerm.val.length > 0) {
          searchFilter.qAttr = _appliedSearchTerm.attr;
          searchFilter.q = _appliedSearchTerm.val;
        } else {
          searchFilter.qAttr = null;
          searchFilter.q = null;
        }

        if (_appliedSortOrder.property) {
          searchFilter.s = _appliedSortOrder.property;
          searchFilter.sOrder = _appliedSortOrder.order === '+' ? 'ASC' : 'DESC';
        }

        mwUrlStorage.setObject(searchFilter, {removeOnUrlChange: true});
      };

      var urlContainsFilters = function () {
        return (mwUrlStorage.getItem('q') && mwUrlStorage.getItem('qAttr')) || mwUrlStorage.getItem('f');
      };

      var urlContainsSortOrder = function () {
        return (mwUrlStorage.getItem('s'));
      };

      this.hasAppliedFilterOrSearchTerm = function () {
        return (_appliedSearchTerm.val && _appliedSearchTerm.val.length > 0) || !_appliedFilter.isNew();
      };

      this.getFilters = function () {
        return _filterHolders;
      };

      // FilterHolders save in backend
      this.fetchFilters = function () {
        if (_filterHolders.length > 0 || _filterHolders.fetched) {
          return $q.when(_filterHolders);
        } else {
          return _filterHolders.fetch().then(function () {
            _filterHolders.fetched = true;
            return _filterHolders;
          });
        }
      };

      this.saveFilter = function (filterModel) {
        _filterHolders.add(filterModel, {merge: true});
        return filterModel.save().then(function (savedModel) {
          _filterHolders.add(savedModel, {merge: true});
          return savedModel;
        });
      };

      this.deleteFilter = function (filterModel) {
        var id = filterModel.id;

        return filterModel.destroy().then(function () {
          if (id === _appliedFilter.id) {
            this.revokeFilter();
          }
        }.bind(this));
      };

      this.getAppliedFilter = function () {
        return _appliedFilter;
      };

      this.filterWasSetByUser = function (filter) {
        return this.fetchFilters().then(function () {
          return !!_filterHolders.findWhere({uuid: filter.uuid});
        }, function () {
          return false;
        });
      };

      this._getAppliedFilterFromUrl = function () {
        var filterUuid = mwUrlStorage.getItem('f');
        if (filterUuid) {
          return {uuid: filterUuid};
        } else {
          return null;
        }
      };

      // Filter that was applied and saved in local storage
      this.fetchAppliedFilter = function () {
        if (urlContainsFilters()) {
          var urlFilter = this._getAppliedFilterFromUrl();
          if (urlFilter) {
            return this.filterWasSetByUser(urlFilter).then(function (wasSetByUser) {
              if (wasSetByUser) {
                // Update localstorage filter
                this.applyFilter(_filterHolders.findWhere(urlFilter));
                return _appliedFilter;
              } else {
                // Do not update local storage but update appliedFilter
                return this.clearAppliedFilter();
              }
            }.bind(this));
          } else {
            return this.clearAppliedFilter();
          }
        } else if (_appliedFilter.get('uuid')) {
          return $q.when(_appliedFilter);
        } else {
          return $q.when(mwRuntimeStorage.getItem(_localFilterIdentifier)).then(function (appliedFilter) {
            if (appliedFilter) {
              return this.filterWasSetByUser(appliedFilter).then(function (wasSetByUser) {
                if (wasSetByUser) {
                  return this.applyFilter(appliedFilter);
                } else {
                  return _appliedFilter;
                }
              }.bind(this));
            } else {
              return _appliedFilter;
            }
          }.bind(this));
        }
      };

      this.clearAppliedFilter = function () {
        _appliedFilter.clear();
        return $q.when(mwRuntimeStorage.removeItem(_localFilterIdentifier)).then(function () {
          setUrlQueryParams();
          return _appliedFilter;
        });
      };

      this.applyFilter = function (filterModel) {
        var jsonFilter;
        if (filterModel instanceof Backbone.Model) {
          jsonFilter = filterModel.toJSON();
        } else if (_.isObject(filterModel)) {
          jsonFilter = filterModel;
        }

        if (jsonFilter && _appliedFilter.id !== jsonFilter.uuid) {
          _appliedFilter.set(jsonFilter);
          setUrlQueryParams();
          return $q.when(mwRuntimeStorage.setItem(_localFilterIdentifier, jsonFilter)).then(function () {
            return _appliedFilter;
          });
        } else {
          return $q.resolve(_appliedFilter);
        }
      };

      this.revokeFilter = function () {
        var promises = [];
        promises.push(this.clearAppliedFilter());
        promises.push(this.clearAppliedSearchTerm());
        return $q.all(promises);
      };

      this.getAppliedSortOrder = function () {
        return _appliedSortOrder;
      };

      this._getAppliedSortOrderFromUrl = function () {
        var property = mwUrlStorage.getItem('s'),
          order = mwUrlStorage.getItem('sOrder');

        if (property) {
          return {
            order: order === 'ASC' ? '+' : '-',
            property: property
          };
        } else {
          return null;
        }
      };

      // Sort order that was applied and saved in local storage
      this.fetchAppliedSortOrder = function () {
        if (urlContainsSortOrder()) {
          var urlSortOrder = this._getAppliedSortOrderFromUrl();
          return this.applySortOrder(urlSortOrder);
        } else if (_appliedSortOrder.order && _appliedSortOrder.property) {
          return $q.when(_appliedSortOrder);
        } else {
          return $q.when(mwRuntimeStorage.getItem(_localSortOrderIdentifier)).then(function (appliedSortOrder) {
            _appliedSortOrder = appliedSortOrder || {order: null, property: null};
            return _appliedSortOrder;
          });
        }
      };

      this.applySortOrder = function (sortOrderObj) {
        if (_.isString(sortOrderObj)) {
          var sortString = sortOrderObj.match(/([+-])(\w+)/);

          if (sortString && sortString.length === 3) {
            sortOrderObj = {
              order: sortString[1],
              property: sortString[2]
            };
          }
        }
        _appliedSortOrder = sortOrderObj;
        _appliedFilter.set(_appliedSortOrder);
        setUrlQueryParams();
        return $q.when(mwRuntimeStorage.setItem(_localSortOrderIdentifier, sortOrderObj)).then(function () {
          return sortOrderObj;
        });
      };

      this.revokeSortOrder = function () {
        _appliedSortOrder = {
          order: null,
          property: null
        };
        return mwRuntimeStorage.removeItem(_localSortOrderIdentifier).then(function () {
          setUrlQueryParams();
        });
      };

      this.clearAppliedSearchTerm = function () {
        _appliedSearchTerm = {
          attr: null,
          val: null
        };
        return $q.when(mwRuntimeStorage.removeItem(_localSearchIdentifier)).then(function () {
          setUrlQueryParams();
          return _appliedFilter;
        });
      };

      this.applySearchTerm = function (attr, searchTerm) {
        if (_appliedSearchTerm.val !== searchTerm && attr) {
          _appliedSearchTerm = {
            attr: attr,
            val: searchTerm && searchTerm.length > 0 ? searchTerm : null
          };
          setUrlQueryParams();
          return $q.when(mwRuntimeStorage.setItem(_localSearchIdentifier, _appliedSearchTerm)).then(function () {
            return _appliedSearchTerm;
          });
        } else {
          return $q.resolve(_appliedSearchTerm);
        }
      };

      this._getAppliedSearchTermFromUrl = function () {
        var searchAttr = mwUrlStorage.getItem('qAttr'),
          searchVal = mwUrlStorage.getItem('q');

        if (searchAttr && searchAttr.length > 0 && searchVal && searchVal.length > 0) {
          return {
            attr: searchAttr,
            val: searchVal
          };
        } else {
          return null;
        }
      };

      this.fetchAppliedSearchTerm = function () {
        if (urlContainsFilters()) {
          var urlSearchTerm = this._getAppliedSearchTermFromUrl();
          if (urlSearchTerm) {
            return this.applySearchTerm(urlSearchTerm.attr, urlSearchTerm.val);
          } else {
            return this.clearAppliedSearchTerm();
          }
        } else if (_appliedSearchTerm.val) {
          return $q.when(_appliedSearchTerm);
        } else {
          return $q.when(mwRuntimeStorage.getItem(_localSearchIdentifier)).then(function (appliedSearch) {
            appliedSearch = appliedSearch || {};
            return this.applySearchTerm(appliedSearch.attr, appliedSearch.val);
          }.bind(this));
        }

      };
    };

    return Filter;
  })

  .service('FilterHolderProvider', function (FilterHolderModel) {
    return {
      createFilterHolder: function () {
        return new FilterHolderModel(); // using new in MwListCollectionFilter above destroys testability
      }
    };
  });

