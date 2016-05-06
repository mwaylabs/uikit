angular.module('mwUI.ResponseHandler')

  .provider('ResponseHandler', function () {

    var _routeHandlersPerMethodContainer = {
      POST: [],
      PUT: [],
      GET: [],
      DELETE: [],
      PATCH: []
    };

    var _methodIsInValidError = function(method){
      return new Error('Method '+method+' is invalid. Valid methods are POST, PUT, GET, DELETE, PATCH');
    };

    var _routeToRegex = mwUI.Utils.shims.routeToRegExp;

    var RouteHandler = function (route) {

      var _codes = {
          ERROR: [],
          SUCCESS: []
        },
        _route = route,
        _routeRegex = null;

      var _registerCallbackForCode = function (code, callback) {

        var existingCallbacks = _codes[code],
          callbacks = existingCallbacks || [];

        callbacks.push(callback);

        _codes[code] = callbacks;
      };

      var _getCallbackForCode = function (code) {
        return _codes[code];
      };

      this.matchesUrl = function (url) {
        return url.match(_routeRegex);
      };

      this.registerCallbackForStatusCodes = function (statusCodes, callback) {
        statusCodes.forEach(function (statusCode) {
          _registerCallbackForCode(statusCode, callback);
        }, this);
      };

      this.registerCallbackForSuccess = function (callback) {
        _registerCallbackForCode('SUCCESS', callback);
      };

      this.registerCallbackForError = function (callback) {
        _registerCallbackForCode('ERROR', callback);
      };

      this.getCallbacksForStatusCode = function (statusCode) {
        return _getCallbackForCode(statusCode);
      };

      this.getCallbacksForSuccess = function () {
        return _getCallbackForCode('SUCCESS');
      };

      this.getCallbacksForError = function () {
        return _getCallbackForCode('ERROR');
      };

      var main = function () {
        _routeRegex = _routeToRegex(_route);
      };

      main.call(this);
    };

    this.registerAction = function (route, callback, options) {
      options = options || {};

      if(!options.onError && !options.onSuccess && !options.statusCodes){
        throw new Error('You have to specify either some statusCodes or set onSuccess or onError to true in the options parameter object');
      }

      if (( options.onError && options.onSuccess ) || ( (options.onError || options.onSuccess) && options.statusCodes )) {
        throw new Error('Definition is too imprecise');
      }
      if (!options.method && !options.methods) {
        throw new Error('Method has to be defined in options e.g method: "POST" or methods:["POST"]');
      }

      options.methods = options.methods || [options.method];

      options.methods.forEach(function(method){

        if (!_routeHandlersPerMethodContainer[method]) {
          throw _methodIsInValidError(method);
        }

        var existingRouteHandlerContainer = _.findWhere(_routeHandlersPerMethodContainer[method], {id: route}),
          routeHandlerContainer = existingRouteHandlerContainer || {id: route, handler: new RouteHandler(route)},
          routeHandler = routeHandlerContainer.handler;

        if (options.statusCodes) {
          routeHandler.registerCallbackForStatusCodes(options.statusCodes, callback);
        } else if (options.onSuccess) {
          routeHandler.registerCallbackForSuccess(callback);
        } else if (options.onError) {
          routeHandler.registerCallbackForError(callback);
        }

        if (!existingRouteHandlerContainer) {
          _routeHandlersPerMethodContainer[method].push(routeHandlerContainer);
        }

      });
    };

    this.registerSuccessAction = function (route, callback, method) {
      return this.registerAction(route, callback, {
        method: method,
        onSuccess: true
      });
    };

    this.registerErrorAction = function (route, callback, method) {
      return this.registerAction(route, callback, {
        method: method,
        onError: true
      });
    };

    this.registerDefaultAction = function(callback, options){
      options = options || {};
      return this.registerAction('*', callback, options);
    };

    this.registerDefaultSuccessAction = function (callback, method) {
      return this.registerAction('*', callback, {
        method: method,
        onSuccess: true
      });
    };

    this.registerDefaultErrorAction = function (callback, method) {
      return this.registerAction('*', callback, {
        method: method,
        onError: true
      });
    };

    this.$get = function ($injector, $q, callbackHandler) {

      /*
       *  Execute promises sequentially
       *  When funtion does not return a promise it converts the response into a promise
       *  The last function defines if the chain should be resolved or rejected by rejecting or resolving value
       *  When the first function rejectes value but the last function resolves it the whole chain will be resolved
       */
      var _executePromiseQueue = function(fns, resp, isError, dfd){
        var fn = fns.shift();

        if(!dfd){
          dfd = $q.defer();
        }

        if(fn){
          var returnVal = fn(resp, isError),
            promise;
          if(returnVal && returnVal.then){
            promise = returnVal;
          } else {
            if(isError){
              promise = $q.reject(returnVal || resp);
            } else {
              promise = $q.when(returnVal || resp);
            }
          }

          promise.then(function(rsp){
            _executePromiseQueue(fns, rsp, false, dfd);
          },function(rsp){
            _executePromiseQueue(fns, rsp, true, dfd);
          });
        } else {
          if(isError){
            dfd.reject(resp);
          } else {
            dfd.resolve(resp);
          }
        }
        return dfd.promise;
      };

      var _executeCallbacks = function (callbacks, response, isError) {
        var fns = [];
        callbacks.forEach(function (callback) {
          callback = callbackHandler.getFn(callback);
          fns.push(callback);
        }, this);
        return _executePromiseQueue(fns, response, isError);
      };

      var _getCallbacks = function(handler, statusCode, isError){
        var statusCallbacks = handler.getCallbacksForStatusCode(statusCode),
          successCallbacks = handler.getCallbacksForSuccess(),
          errorCallbacks = handler.getCallbacksForError();

        if(statusCallbacks){
          return statusCallbacks;
        } else if(isError){
          return errorCallbacks;
        } else {
          return successCallbacks;
        }
      };

      return {
        getHandlerForUrlAndCode: function (method, url, statusCode, isError) {
          var _returnHandler;

          if (!_routeHandlersPerMethodContainer[method]) {
            throw _methodIsInValidError(method);
          }

          _routeHandlersPerMethodContainer[method].forEach(function (routeHandlerContainer) {
            var handler = routeHandlerContainer.handler,
              callbacks = _getCallbacks(handler, statusCode, isError);
            if (!_returnHandler && handler.matchesUrl(url) && callbacks && callbacks.length>0) {
              _returnHandler = handler;
            }
          });

          return _returnHandler;
        },
        handle: function (response, isError) {
          var url = response.config.url,
            method = response.config.method,
            statusCode = response.status,
            handler = this.getHandlerForUrlAndCode(method, url, statusCode, isError);

          if (handler) {
            var callbacks = _getCallbacks(handler, statusCode, isError);
            if(callbacks){
              return _executeCallbacks(callbacks, response, isError);
            }
          }
        }
      };
    };
  });

