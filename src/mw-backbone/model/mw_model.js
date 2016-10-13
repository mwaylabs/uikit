mwUI.Backbone.Model = mwUI.Backbone.NestedModel.extend({
  selectable: true,
  basePath: '',
  endpoint: null,
  selectableOptions: mwUI.Backbone.SelectableModel.prototype.selectableOptions,
  urlRoot: function () {
    var basePath = _.result(this, 'basePath'),
      endpoint = _.result(this, 'endpoint');

    if (endpoint) {
      return window.mwUI.Utils.shims.concatUrlParts(mwUI.Backbone.baseUrl,basePath,endpoint);
    } else {
      throw new Error('An endpoint has to be specified');
    }
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
    options = options || {};
    var requestOptions = {
      url: url,
      type: method,
      instance: this
    };
    return Backbone.ajax(_.extend(requestOptions, options));
  }
});
