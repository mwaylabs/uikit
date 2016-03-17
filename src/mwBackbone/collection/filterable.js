/**
 * Created by zarges on 04/03/16.
 */
/*jshint unused:false */
mwUI.Backbone.Filterable = function (collectionInstance, options) {

  options = options || {};

  var _collection = collectionInstance,
    _limit = options.limit,
    _offset = _limit ? options.offset : false,
    _page = options.page || 1,
    _perPage = options.perPage || 30,
    _initialFilterValues = options.filterValues ? JSON.parse(JSON.stringify(options.filterValues)) : options.filterValues,
    _initialCustomUrlParams = _.clone(options.customUrlParams),
    _filterDefinition = options.filterDefinition,
    _sortOrder = options.sortOrder,
    _totalAmount,
    _lastFilter;

  this.filterValues = options.filterValues || {};
  this.customUrlParams = options.customUrlParams || {};
  this.fields = options.fields;
  this.filterIsSet = false;

  this.hasFilterChanged = function(filter){
    return JSON.stringify(filter) !== JSON.stringify(_lastFilter);
  };

  this.getRequestParams = function (options) {
    options.params = options.params || {};

    // Filter functionality
    var filter = this.getFilters();
    if (filter) {
      options.params.filter = filter;
    }

    //reset pagination if filter values change
    if (this.hasFilterChanged(filter)) {
      _page = 1;
    }

    // Pagination functionality
    if (_perPage && _page && (_limit || _.isUndefined(_limit))) {
      options.params.limit = _perPage;

      // Calculate offset
      options.params.offset = _page > 1 ? _perPage * (_page - 1) : 0;
    }

    // Sort order
    if (_sortOrder && _sortOrder.length > 0) {
      options.params.sortOrder = _sortOrder;
    }

    // Fallback to limit and offset if they're set manually, overwrites pagination settings
    if (_limit || _offset) {
      options.params.limit = _limit;
      options.params.offset = _offset;
    }

    if (_limit === false) {
      delete options.params.limit;
    }

    if (this.fields && this.fields.length > 0) {
      options.params.field = this.fields;
    }

    // Custom URL parameters
    if (this.customUrlParams) {
      _.extend(options.params, _.result(this, 'customUrlParams'));
    }

    //always set non paged parameter
    options.params.getNonpagedCount = true;

    _lastFilter = filter;

    return options.params;
  };

  this.setLimit = function (limit) {
    _limit = limit;
    _offset = _offset || 0;
  };

  this.setTotalAmount = function (totalAmount) {
    _totalAmount = totalAmount;
  };

  this.getTotalAmount = function () {
    return _totalAmount;
  };

  this.loadPreviousPage = function () {
    _page -= 1;
    return _collection.fetch({remove: false});
  };

  this.hasPreviousPage = function () {
    return _page >= 1;
  };

  this.loadNextPage = function () {
    _page += 1;
    return _collection.fetch({remove: false});
  };

  this.hasNextPage = function () {
    return _totalAmount && _totalAmount > _collection.length;
  };

  this.getPage = function () {
    return _page;
  };

  this.getTotalPages = function () {
    return Math.floor(_totalAmount / _perPage);
  };

  this.setSortOrder = function (sortOrder) {
    _page = 1;
    _sortOrder = sortOrder;
  };

  this.getSortOrder = function () {
    return _sortOrder;
  };

  this.setFilters = function (filterMap) {

    _.forEach(filterMap, function (value, key) {
      if (_.has(this.filterValues, key)) {
        this.filterValues[key] = value;
      } else {
        throw new Error('Filter named \'' + key + '\' not found, did you add it to filterValues of the model?');
      }
    }, this);

    this.filterIsSet = true;

  };

  this.getFilters = function () {
    if (_.isFunction(_filterDefinition)) {
      return _filterDefinition.apply(this);
    }
  };

  this.resetFilters = function () {
    this.filterValues = _initialFilterValues ? JSON.parse(JSON.stringify(_initialFilterValues)) : _initialFilterValues;
    this.customUrlParams = _initialCustomUrlParams;
    this.filterIsSet = false;
  };

  (function _main() {
    if (!(_collection instanceof Backbone.Collection)) {
      throw new Error('First parameter has to be the instance of a collection');
    }

  }());
};