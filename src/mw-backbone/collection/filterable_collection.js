mwUI.Backbone.FilterableCollection = Backbone.FilterableCollection = Backbone.Collection.extend({
  selectable: true,
  filterableOptions: function () {
    return {
      limit: undefined,
      offset: false,
      page: 1,
      perPage: 30,
      filterValues: {},
      customUrlParams: {},
      filterDefinition: function () {},
      fields: [],
      sortOrder: ''
    };
  },
  filterableCollectionConstructor: function (options) {
    if (this.filterable) {
      this.filterable = new mwUI.Backbone.Filterable(this, this.filterableOptions.call(this, options));
    }
  },
  constructor: function (attributes, options) {
    var superConstructor = Backbone.Model.prototype.constructor.call(this, attributes, options);
    this.filterableCollectionConstructor(options);
    return superConstructor;
  },
  fetch: function (options) {
    options = options || {};
    options.params = options.params || {};

    if (this.filterable) {
      var filterableParams = this.filterable.getRequestParams(options);
      _.extend(options.params, filterableParams);
    }

    return Backbone.Collection.prototype.fetch.call(this, options);
  }
});