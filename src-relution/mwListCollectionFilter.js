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
        _filterHolders = new FilterHoldersCollection(null, type),
        _appliedFilter = FilterHolderProvider.createFilterHolder(),
        _appliedSortOrder = {
          order: null,
          property: null
        };


      this.getFilters = function () {
        return _filterHolders;
      };

      // FilterHolders save in backend
      this.fetchFilters = function () {
        if (_filterHolders.length > 0) {
          return $q.when(_filterHolders);
        } else {
          return _filterHolders.fetch();
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

      this._waitForAuthenticatedUser = function () {
        var dfd = $q.defer();
        if (AuthenticatedUser.get('authenticated')) {
          dfd.resolve(AuthenticatedUser);
        } else {
          AuthenticatedUser.once('change:authenticated', function () {
            dfd.resolve(AuthenticatedUser);
          });
        }
        return dfd.promise;
      };

      this._localFilterWasSetByUser = function (localFilter) {
        return this._waitForAuthenticatedUser().then(function () {
          var wasSetByUser = false;
          if(_.isArray(localFilter.aclEntries)){
            localFilter.aclEntries.forEach(function (aclEntry) {
              if (!wasSetByUser) {
                var aclUuid = aclEntry.split(':')[0],
                  userUuid = AuthenticatedUser.get('uuid');
                wasSetByUser = (aclUuid === userUuid);
              }
            });
          }
          return wasSetByUser;
        });
      };

      this._setAppliedFilter = function (appliedFilter) {
        return this._localFilterWasSetByUser(appliedFilter).then(function (wasSetByUser) {
          if (wasSetByUser) {
            _appliedFilter.set(appliedFilter);
          }
          return _appliedFilter;
        });
      };

      // Filter that was applied and saved in local storage
      this.fetchAppliedFilter = function () {
        if (_appliedFilter.get('uuid')) {
          return $q.when(_appliedFilter);
        } else {
          return LocalForage.getItem(_localFilterIdentifier).then(function (appliedFilter) {
            if(appliedFilter){
              return this._setAppliedFilter(appliedFilter);
            } else {
              return _appliedFilter;
            }
          }.bind(this));
        }
      };

      this.applyFilter = function (filterModel) {
        var jsonFilter = filterModel.toJSON();

        _appliedFilter.set(jsonFilter);
        return LocalForage.setItem(_localFilterIdentifier, jsonFilter);
      };

      this.revokeFilter = function () {
        _appliedFilter.clear();
        return LocalForage.removeItem(_localFilterIdentifier);
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
        if(_.isString(sortOrderObj) && sortOrderObj.match(/[+-]\w+/)){
          var sortString = sortOrderObj;

          sortOrderObj = {
            order: sortString[0],
            property: sortString.replace(/[+-]/g,'')
          }
        }

        _appliedFilter.set(sortOrderObj);
        return LocalForage.setItem(_localSortOrderIdentifier, sortOrderObj);
      };

      this.revokeSortOrder = function () {
        return LocalForage.removeItem(_localSortOrderIdentifier);
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