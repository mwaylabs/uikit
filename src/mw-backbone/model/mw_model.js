mwUI.Backbone.Model = mwUI.Backbone.NestedModel.extend({
  selectable: true,
  hostName: function(){
    return mwUI.Backbone.hostName;
  },
  basePath: function(){
    return mwUI.Backbone.basePath;
  },
  endpoint: null,
  selectableOptions: mwUI.Backbone.SelectableModel.prototype.selectableOptions,
  urlRoot: function () {
   return mwUI.Backbone.Utils.getUrl(this);
  },
  constructor: function () {
    var superConstructor = mwUI.Backbone.NestedModel.prototype.constructor.apply(this, arguments);
    mwUI.Backbone.SelectableModel.prototype.selectableModelConstructor.apply(this, arguments);
    return superConstructor;
  },
  getEndpoint: function () {
    return this.urlRoot();
  },
  setEndpoint: function (endpoint) {
    this.endpoint = endpoint;
  },
  sync: function (method, model, options) {
    options.instance = this;
    return mwUI.Backbone.NestedModel.prototype.sync.call(this, method, model, options);
  },
  request: function (url, method, options) {
    return mwUI.Backbone.Utils.request(url, method, options, this);
  }
});
