mwUI.Backbone.FilterableCollection = Backbone.FilterableCollection = Backbone.Collection.extend({
  selectable: true,
  filterableOptions: function(){
    return {
      limit: false,
      offset: false,
      page: 1,
      perPage: 30,
      filterValues: {},
      customUrlParams: {},
      filterDefinition: function(){},
      fields: [],
      sortOrder: ''
    };
  },
  filterableCollectionConstructor: function(){
    if (this.filterable) {
      this.filterable = new Filterable(this, this.filterableOptions.apply(this));
    }
  },
  constructor: function (attributes, options) {
    this.filterableCollectionConstructor();
    return Backbone.Model.prototype.constructor.call(this, attributes, options);
  }
});