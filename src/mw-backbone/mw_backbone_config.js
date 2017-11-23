var _backboneAjax = Backbone.ajax,
  _backboneSync = Backbone.sync,
  _$http,
  _$q;

angular.module('mwUI.Backbone')

  .run(function ($http, $q) {
    _$http = $http;
    _$q = $q;
  });

Backbone.ajax = function (options) {
  if (mwUI.Backbone.use$http && _$http) {
    // Set HTTP Verb as 'method'
    options.method = options.type;

    //Trigger sync event in case backbone.ajax is called manually and not by model/collection
    if(!options.success && !options.error && options.instance){
      options.instance.isSynchronising = true;
      options.instance.trigger('request');
    }

    // Use angulars $http implementation for requests
    return _$http.apply(angular, arguments).then(function(resp){
      if (options.success && typeof options.success === 'function') {
        options.success(resp);
      } else if(options.instance){
        //Trigger success event in case backbone.ajax is called manually and not by model/collection
        options.instance.isSynchronising = false;
        options.instance.trigger('sync');
      }
      return resp;
    }, function(resp){
      if (options.error && typeof options.error === 'function') {
        options.error(resp);
      } else if(options.instance){
        //Trigger error event in case backbone.ajax is called manually and not by model/collection
        options.instance.isSynchronising = false;
        options.instance.trigger('error');
      }
      return _$q.reject(resp);
    });
  } else {
    return _backboneAjax.apply(this, arguments);
  }
};

Backbone.sync = function (method, modelOrCollection, options) {
  // we have to set the flag to wait true otherwise all cases were you want to delete mutliple entries will break
  // https://github.com/jashkenas/backbone/issues/3534
  // This flag means that the server has to confirm the creation/deletion before the model will be added/removed to the
  // collection
  options = options || {};
  if (_.isUndefined(options.wait)) {
    options.wait = true;
  }

  modelOrCollection.isSynchronising = true;

  // Instead of the response object we are returning the backbone model in the promise
  return _backboneSync.call(Backbone, method, modelOrCollection, options).then(function () {
    modelOrCollection.isSynchronising = false;
    return modelOrCollection;
  }, function(resp){
    modelOrCollection.isSynchronising = false;
    return _$q.reject(resp);
  });
};