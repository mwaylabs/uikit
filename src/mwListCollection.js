/**
 * Created by zarges on 27/05/15.
 */
'use strict';

angular.module('mwCollection', [])

  .service('MwListCollection', function ($q, MCAPFilterHolders, MCAPFilterHolder, MwListCollectionFilter) {

    var MwListCollection = function(collection, id){

      var _collection = collection,
          _id = id || collection.endpoint,
          _mwFilter = new MwListCollectionFilter(_id);

      this.getMwListCollectionFilter = function(){
        return _mwFilter;
      };

      this.getCollection = function(){
        return _collection;
      };

      this.fetch = function(){
        var mwListCollectionFilter = this.getMwListCollectionFilter();

        return $q.all([mwListCollectionFilter.fetchAppliedFilter(),mwListCollectionFilter.fetchAppliedSortOrder()]).then(function(rsp){
          var appliedFilter = rsp[0],
              sortOrder = rsp[1];

          _collection.filterable.setSortOrder(sortOrder.order+sortOrder.property);
          _collection.filterable.setFilters(appliedFilter.get('filterValues'));
          return $q.all([_collection.fetch(),mwListCollectionFilter.fetchFilters()]).then(function(){
            return this;
          }.bind(this));
        }.bind(this));
      };
    };

    return MwListCollection;

  });