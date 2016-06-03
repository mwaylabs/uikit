var _backboneAjax = Backbone.ajax,
  _backboneSync = Backbone.sync,
  _$http;

angular.module('mwUI.Backbone')

  .run(function ($http) {
    _$http = $http;
  });

Backbone.ajax = function (options) {
  if (mwUI.Backbone.use$http && _$http) {
    // Set HTTP Verb as 'method'
    options.method = options.type;
    // Use angulars $http implementation for requests
    return _$http.apply(angular, arguments);
  } else {
    return _backboneAjax.apply(this, arguments);
  }
};

Backbone.sync = function (method, model, options) {
  // Instead of the response object we are returning the backbone model in the promise
  return _backboneSync.call(Backbone, method, model, options).then(function () {
    return model;
  });
};