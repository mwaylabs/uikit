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
  filterableCollectionConstructor: function(options){
    if (this.filterable) {
      this.filterable = new mwUI.Backbone.Filterable(this, this.filterableOptions.call(this, options));
    }
  },
  constructor: function (attributes, options) {
    var superConstructor =  Backbone.Model.prototype.constructor.call(this, attributes, options);
    this.filterableCollectionConstructor(options);
    return superConstructor;
  }
});