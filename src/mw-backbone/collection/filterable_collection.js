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
    var superConstructor = Backbone.Collection.prototype.constructor.call(this, attributes, options);
    this.filterableCollectionConstructor(options);
    return superConstructor;
  },
  fetch: function (options) {
    options = options || {};

    if (this.filterable) {
      var filterableParams = this.filterable.getRequestParams(options);

      if(window.mwUI.Backbone.use$http){
        //$http is using options.params to generate GET query params
        options.params = options.params || {};
        _.extend(options.params, filterableParams);
      } else {
        //jquery ajax does not have a params a params option attribute for query params
        options.data = options.data || {};
        _.extend(options.data, filterableParams);
      }
    }

    return Backbone.Collection.prototype.fetch.call(this, options);
  }
});