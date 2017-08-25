/**
 * Created by zarges on 27/05/15.
 */
'use strict';

angular.module('mwCollection', ['ngRoute', 'mwUI.Backbone', 'mwUI.Utils'])

  .service('MwListCollection', function ($q, MwListCollectionFilter) {

    var MwListCollection = function (collection, id) {

      var _collection = collection,
        _id = (id || collection.endpoint) + '_V1',
        _mwFilter = new MwListCollectionFilter(_id);

      this.getMwListCollectionFilter = function () {
        return _mwFilter;
      };

      this.getCollection = function () {
        return _collection;
      };

      this.fetch = function () {
        var mwListCollectionFilter = this.getMwListCollectionFilter();

        return $q.all([
          mwListCollectionFilter.fetchAppliedFilter(),
          mwListCollectionFilter.fetchAppliedSortOrder(),
          mwListCollectionFilter.fetchAppliedSearchTerm()
        ]).then(function (rsp) {
          var appliedFilter = rsp[0],
            sortOrder = rsp[1],
            searchTerm = rsp[2],
            filterValues = appliedFilter.get('filterValues');

          if (sortOrder.property) {
            _collection.filterable.setSortOrder(sortOrder.order + sortOrder.property);
          }

          if (searchTerm.val) {
            var searchTermFilter = {};
            searchTermFilter[searchTerm.attr] = searchTerm.val;
            try{
              _collection.filterable.setFilters(searchTermFilter);
            } catch (err){
              console.warn('[MwListCollection] The filter attribute '+searchTerm.attr+' for the searchterm '+searchTerm.val+' does not exist!');
              mwListCollectionFilter.clearAppliedSearchTerm();
            }
          }

          if (!appliedFilter.isNew()) {
            try{
              _collection.filterable.setFilters(filterValues);
            } catch(err){
              console.warn('[MwListCollection] Filter could not be applied!',err);
              mwListCollectionFilter.clearAppliedFilter();
            }
          }

          if (!mwListCollectionFilter.hasAppliedFilterOrSearchTerm()) {
            _collection.filterable.filterIsSet = false;
          }

          return _collection.fetch().then(function () {
            return this;
          }.bind(this));
        }.bind(this));
      };

      collection.on('change:sortOrder', function (sortOrder) {
        this.getMwListCollectionFilter().applySortOrder(sortOrder);
      }, this);
    };

    return MwListCollection;

  });