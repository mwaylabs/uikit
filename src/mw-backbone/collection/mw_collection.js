mwUI.Backbone.Collection = Backbone.Collection.extend({
  selectable: true,
  filterable: true,
  hostName: function(){
    return mwUI.Backbone.hostName;
  },
  basePath: function(){
    return mwUI.Backbone.basePath;
  },
  endpoint: null,
  selectableOptions: mwUI.Backbone.SelectableCollection.prototype.selectableOptions,
  filterableOptions: mwUI.Backbone.FilterableCollection.prototype.filterableOptions,
  model: mwUI.Backbone.Model,
  url: function () {
    return window.mwUI.Backbone.Utils.getUrlWithEndpoint(this);
  },
  getEndpoint: function () {
    return this.url();
  },
  setEndpoint: function (endpoint) {
    this.endpoint = endpoint;
  },
  replace: function (models) {
    this.reset(models);
    this.trigger('replace', this);
  },
  constructor: function () {
    var superConstructor = Backbone.Collection.prototype.constructor.apply(this, arguments);
    mwUI.Backbone.SelectableCollection.prototype.selectableCollectionConstructor.apply(this, arguments);
    mwUI.Backbone.FilterableCollection.prototype.filterableCollectionConstructor.apply(this, arguments);
    return superConstructor;
  },
  fetch: function () {
    return mwUI.Backbone.FilterableCollection.prototype.fetch.apply(this, arguments);
  }
});