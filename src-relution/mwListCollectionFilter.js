angular.module('mwCollection')

  .service('MwListCollectionFilter', function ($q,
                                               LocalForage,
                                               FilterHoldersCollection,
                                               FilterHolderProvider,
                                               AuthenticatedUser) {

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

      this._setAppliedFilter = function (appliedFilter) {
        _appliedFilter.set(appliedFilter);
        return _appliedFilter;
      };

      this.filterWasSetByUser = function (filter) {
        return this.fetchFilters().then(function () {
          return !!_filterHolders.get(filter);
        });
      };

      // Filter that was applied and saved in local storage
      this.fetchAppliedFilter = function () {
        if (_appliedFilter.get('uuid')) {
          return $q.when(_appliedFilter);
        } else {
          return LocalForage.getItem(_localFilterIdentifier).then(function (appliedFilter) {
            if (appliedFilter) {
              return this._setAppliedFilter(appliedFilter);
            } else {
              return _appliedFilter;
            }
          }.bind(this));
        }
      };

      this.unSetFilter = function () {
        _appliedFilter.clear();
      };

      this.applyFilter = function (filterModel) {
        var jsonFilter = filterModel.toJSON();

        _appliedFilter.set(jsonFilter);
        return LocalForage.setItem(_localFilterIdentifier, jsonFilter);
      };

      this.revokeFilter = function () {
        var promises = [];
        _appliedFilter.clear();
        _appliedSearchTerm = {
          attr: null,
          val: null
        };
        promises.push(LocalForage.removeItem(_localFilterIdentifier));
        promises.push(LocalForage.removeItem(_localSearchIdentifier));
        return $q.all(promises);
      };

      this.getAppliedSortOrder = function () {
        return _appliedSortOrder;
      };

      // Sort order that was applied and saved in local storage
      this.fetchAppliedSortOrder = function () {
        if (_appliedSortOrder.order && _appliedSortOrder.property) {
          return $q.when(_appliedSortOrder);
        } else {
          return LocalForage.getItem(_localSortOrderIdentifier).then(function (appliedSortOrder) {
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
            }
          }
        }

        _appliedFilter.set(sortOrderObj);
        return LocalForage.setItem(_localSortOrderIdentifier, sortOrderObj);
      };

      this.revokeSortOrder = function () {
        return LocalForage.removeItem(_localSortOrderIdentifier);
      };

      this.applySearchTerm = function (attr, searchTerm) {
        _appliedSearchTerm = {
          attr: attr,
          val: searchTerm.length > 0 ? searchTerm : null
        };
        return LocalForage.setItem(_localSearchIdentifier, _appliedSearchTerm);
      };

      this.fetchAppliedSearchTerm = function () {
        if (_appliedSearchTerm.val) {
          return $q.when(_appliedSearchTerm);
        } else {
          return LocalForage.getItem(_localSearchIdentifier).then(function (appliedSearch) {
            appliedSearch = appliedSearch || {};
            _appliedSearchTerm = {
              attr: appliedSearch.attr,
              val: appliedSearch.val
            };
            return _appliedSearchTerm;
          });
        }
      }

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