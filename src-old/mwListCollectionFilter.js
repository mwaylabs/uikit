/**
 * Created by zarges on 27/05/15.
 */
'use strict';

angular.module('mwCollection')

  .service('MwListCollectionFilter', function ($q, $timeout, LocalForage, MCAPFilterHolders, MCAPFilterHolder) {

    var Filter = function (type) {

      var _type = type,
        _localFilterIdentifier = 'applied_filter_' + _type,
        _localSordOrderIdentifier = 'applied_sort_order_' + _type,
        _filterHolders = new MCAPFilterHolders(null, type),
        _appliedFilter = new MCAPFilterHolder(),
        _appliedSortOrder = {
          order: null,
          property: null
        };


      this.getFilters = function(){
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
        return filterModel.save().then(function(savedModel){
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


      this.getAppliedFilter = function(){
        return _appliedFilter;
      };

      // Filter that was applied and saved in local storage
      this.fetchAppliedFilter = function () {
        if (_appliedFilter.get('uuid')) {
          return $q.when(_appliedFilter);
        } else {
          return LocalForage.getItem(_localFilterIdentifier).then(function (appliedFilter) {
            _appliedFilter.set(appliedFilter);
            return _appliedFilter;
          });
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

      this.getAppliedSortOrder = function(){
        return _appliedSortOrder;
      };

      // Sort order that was applied and saved in local storage
      this.fetchAppliedSortOrder = function () {
        if (_appliedSortOrder.order && _appliedSortOrder.property) {
          return $q.when(_appliedSortOrder);
        } else {
          return LocalForage.getItem(_localSordOrderIdentifier).then(function (appliedSortOrder) {
            _appliedSortOrder = appliedSortOrder || {order: null, property: null};
            return _appliedSortOrder;
          });
        }
      };

      this.applySortOrder = function (sortOrderObj) {

        _appliedFilter.set(sortOrderObj);
        return LocalForage.setItem(_localSordOrderIdentifier, sortOrderObj);
      };

      this.revokeSortOrder = function () {
        return LocalForage.removeItem(_localSordOrderIdentifier);
      };

    };

    return Filter;
  });