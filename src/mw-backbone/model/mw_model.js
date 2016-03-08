mwUI.Backbone.Model = mwUI.Backbone.NestedModel.extend({
  selectable: true,
  baseUrl: '',
  endpoint: null,
  selectableOptions: mwUI.Backbone.SelectableModel.prototype.selectableOptions,
  urlRoot: function () {
    var baseUrl = _.result(this, 'baseUrl'),
      endpoint = _.result(this, 'endpoint');

    if (endpoint) {
      return window.mwUI.Utils.shims.concatUrlParts(baseUrl,endpoint);
    } else {
      throw new Error('An endpoint has to be specified');
    }
  },
  getEndpoint: function () {
    return this.urlRoot();
  },
  setEndpoint: function(endpoint){
    this.endpoint = endpoint;
  },
  constructor: function () {
    var superConstructor = mwUI.Backbone.NestedModel.prototype.constructor.apply(this,arguments);
    mwUI.Backbone.SelectableModel.prototype.selectableModelConstructor.apply(this,arguments);
    return superConstructor;
  }
});
