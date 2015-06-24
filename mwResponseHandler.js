/**
 * Created by zarges on 23/06/15.
 */
'use strict';
angular.module('mwResponseHandler', [])

  .provider('ResponseHandler', function () {

    var _routeHandlersContainer = [];

    var RouteHandler = function(route){

      var _methods = {
        POST: {},
        PUT: {},
        GET: {},
        DELETE: {},
        PATCH: {}
        },
        _route = route,
        _routeRegex = null,
        _optionalParam = /\((.*?)\)/g,
        _namedParam = /(\(\?)?:\w+/g,
        _splatParam = /\*\w?/g,
        _escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

      var _throwMethodNotAvailableError = function(method){
        throw new Error('The method '+method+'is not available. Available methods are: '+_methods.join(','));
      };

      var _routeToRegExp = function(route) {
        route = route.replace(_escapeRegExp, '\\$&')
          .replace(_optionalParam, '(?:$1)?')
          .replace(_namedParam, function(match, optional) {
            return optional ? match : '([^/?]+)';
          })
          .replace(_splatParam, '([^?]*?)');
        return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
      };

      var _registerCallbackForType = function(method, type, callback){
        if(_methods[method]){
          var existingCallbacks = _methods[method][type],
            callbacks = existingCallbacks || [];

          callbacks.push(callback);

          _methods[method][type] = callbacks;
        } else {
          _throwMethodNotAvailableError(method);
        }
      };

      var _getCallbackForType = function(method, type){
        if(_methods[method]){
         return  _methods[method][type];
        } else {
          _throwMethodNotAvailableError(method);
        }
      };

      this.matchesUrl = function(url){
        return url.match(_routeRegex);
      };

      this.registerCallbackForStatusCodes = function(method, statusCodes, callback){
        statusCodes.forEach(function(statusCode){
          _registerCallbackForType(method, statusCode, callback);
        }, this);
      };

      this.registerCallbackForSuccess = function(method, callback){
        _registerCallbackForType(method, 'SUCCESS', callback);
      };

      this.registerCallbackForError = function(method, callback){
        _registerCallbackForType(method, 'ERROR', callback);
      };

      this.getCallbacksForStatusCode = function(method, statusCode){
        return _getCallbackForType(method, statusCode);
      };

      this.getCallbacksForSuccess = function(method){
        return _getCallbackForType(method, 'SUCCESS');
      };

      this.getCallbacksForError = function(method){
        return _getCallbackForType(method, 'ERROR');
      };

      var main = function(){
        _routeRegex = _routeToRegExp(_route);
      };

      main.call(this);
    };

    this.registerAction = function(route, callback, options){
      options = options || {};

      if( ( options.onError && options.onSuccess ) || ( (options.onError || options.onSuccess) && options.statusCodes ) ){
        throw new Error('Definition is too imprecise');
      }
      if(!_.isArray(options.methods) || options.methods.length<1){
        throw new Error('Methods have to be defined in options as an array e.g methods: ["POST"]');
      }

      var existingRouteHandlerContainer = _.findWhere(_routeHandlersContainer, {id: route}),
          routeHandlerContainer = existingRouteHandlerContainer || {id: route, handler: new RouteHandler(route)},
          routeHandler = routeHandlerContainer.handler;

      options.methods.forEach(function(method){
        if(options.statusCodes){
          routeHandler.registerCallbackForStatusCodes(method, options.statusCodes, callback);
        } else if(options.onSuccess){
          routeHandler.registerCallbackForSuccess(method, callback);
        } else if(options.onError){
          routeHandler.registerCallbackForError(method, callback);
        }
      });

      if(!existingRouteHandlerContainer){
        _routeHandlersContainer.push(routeHandlerContainer);
      }

      return routeHandler;
    };

    this.registerSuccessAction = function(route, callback, methods){
      return this.registerAction(route, callback, {
        methods: methods,
        onSuccess: true
      });
    };

    this.registerErrorAction = function(route, callback, methods){
      return this.registerAction(route, callback, {
        methods: methods,
        onError: true
      });
    };

    this.$get = function ($injector) {

      var _executeCallback = function(callbacks, response){
        callbacks.forEach(function(callback){
          callback = angular.isString(callback) ? $injector.get(callback) : $injector.invoke(callback);
          callback.call(this, response);
        }, this);
      };

      return {
        getHandlerForUrl: function(url){
          var _returnHandler;

          _routeHandlersContainer.forEach(function(routeHandlerContainer) {
            var handler = routeHandlerContainer.handler;
              if(!_returnHandler && handler.matchesUrl(url)){
                _returnHandler = handler;
              }
          });

          return _returnHandler;
        },
        handle: function (response, isError) {
          var url = response.config.url,
            method = response.config.method,
            statusCode = response.status,
            handler = this.getHandlerForUrl(url);

          if(handler){
            var statusCodeCallback = handler.getCallbacksForStatusCode(method, statusCode);

            if(statusCodeCallback){
              _executeCallback(statusCodeCallback, response);
            } else if(isError){
              var isErrorCallback = handler.getCallbacksForSuccess(method);
              _executeCallback(isErrorCallback, response);
            } else {
              var isSuccessCallback = handler.getCallbacksForSuccess(method);
              _executeCallback(isSuccessCallback, response);
            }
          }
        }
      };
    };
  })

  .config(function($provide, $httpProvider){

    $provide.factory('requestInterceptorForHandling', function (ResponseHandler) {
      return {
        response: function(response){
          ResponseHandler.handle(response, false);
          return response;
        },
        responseError: function(response){
          ResponseHandler.handle(response, true);
          return response;
        }
      };
    });

    $httpProvider.interceptors.push('requestInterceptorForHandling');

  });