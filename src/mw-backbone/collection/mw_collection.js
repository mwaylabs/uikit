mwUI.Backbone.Collection = Backbone.Collection.extend({
  selectable: true,
  filterable: true,
  hostName: function () {
    return mwUI.Backbone.hostName;
  },
  basePath: function () {
    return mwUI.Backbone.basePath;
  },
  endpoint: null,
  selectableOptions: mwUI.Backbone.SelectableCollection.prototype.selectableOptions,
  filterableOptions: mwUI.Backbone.FilterableCollection.prototype.filterableOptions,
  model: mwUI.Backbone.Model,
  secureEach: function (callback, ctx) {
    // This method can be used when items are removed from the collection during the each loop
    // When doing this in the normal each method you will get referencing issues—in java terms you
    // would get a ConcurrentModificationException
    _.pluck(this.models, 'cid').forEach(function (cid, index) {
      var model = this.get(cid, index);
      callback.call(ctx, model, index, this.models);
    }.bind(this));
  },
  url: function () {
    return window.mwUI.Backbone.Utils.getUrl(this);
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
  },
  request: function (url, method, options) {
    return window.mwUI.Backbone.Utils.request(url, method, options, this);
  }
});