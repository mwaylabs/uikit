/**
 * Created by zarges on 15/02/16.
 */

var _$http,
  _$q,
  _sync = Backbone.sync,
  _ajax = Backbone.ajax;

angular.module('mwUI.Backbone')

  .config(function () {
    Backbone.sync = function (method, model, options) {
      // Instead of the response object we are returning the backbone model in the promise
      return _sync.call(Backbone, method, model, options).then(function () {
        return model;
      });
    };
    // We are the backbone
    Backbone.ajax = function (options) {
      if (_$http) {
        // Set HTTP Verb as 'method'
        options.method = options.type;
        // Use angulars $http implementation for requests
        return _$http.apply(angular, arguments);
      } else {
        return _ajax.apply(this, arguments);
      }
    };
  })

  .run(function ($http, $q) {
    _$http = $http;
    _$q = $q;
  });