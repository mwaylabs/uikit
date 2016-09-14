angular.module('mwUI.ResponseToastHandler')

  .provider('ResponseToastHandler', function ($provide, ResponseHandlerProvider) {
    var _registeredIds = [],
      _registeredToastOptions = {
        DEFAULT: {
          type: 'default',
          autoHide: false
        }
      };

    var _getNotificationCallback = function (messages, id, options) {
      options = options || {};
      var factoryName = _.uniqueId('notification_factory');
      $provide.factory(factoryName, ['Toast', 'i18n', 'callbackHandler', function (Toast, i18n, callbackHandler) {
        return function ($httpResponse) {
          if(!messages){
            return;
          }

          var prevToast = Toast.findToast(id),
            data = {},
            messageStr = prevToast ? messages.plural : messages.singular,
            message,
            toastOptions = {
              id: id
            };

          if (!!prevToast && messages.plural) {
            messageStr = messages.plural;
          } else if (messages.singular) {
            messageStr = messages.singular;
          }

          data.$count = prevToast ? prevToast.replaceCount + 1 : 0;
          data.$count++;

          data.$httpStatusCode = $httpResponse.status;

          if (options.preProcess) {
            _.extend(data, $httpResponse.data);

            message = callbackHandler.exec(options.preProcess, [messageStr, data, i18n, $httpResponse], this);
            if(!message){
              return;
            }
          } else {
            var resp = $httpResponse.data || {};

            if (resp.results && !_.isObject(resp.results)) {
              data = {message: resp.results};
            } else if (resp.results && resp.results.length > 0) {
              _.extend(data, resp.results[0]);
            }

            if ($httpResponse.config.instance && typeof $httpResponse.config.instance.toJSON === 'function') {
              var json = $httpResponse.config.instance.toJSON();
              _.extend(json, data);
              data = json;
            }

            message = i18n.get(messageStr, data);
          }

          if (options.toastType) {
            var opts = _registeredToastOptions[options.toastType];
            if (opts) {
              _.extend(toastOptions, opts);
            } else {
              throw new Error('Type ' + options.toastType + ' is not available. Make sure you have configured it first');
            }
          } else {
            _.extend(toastOptions, _registeredToastOptions.DEFAULT);
          }

          Toast.addToast(message, toastOptions);
        };
      }]);
      return factoryName;
    };

    this.registerToastType = function (typeId, toastOptions) {
      if (_registeredToastOptions[typeId]) {
        throw new Error('The toast type ' + typeId + ' is already defined. You can configure a toast type only once');
      } else {
        _registeredToastOptions[typeId] = toastOptions;
      }
    };

    this.registerToast = function (route, messages, options) {
      options = options || {};
      var codes = options.statusCodes || [options.onSuccess ? 'SUCCESS' : 'ERROR'];

      if (_.isUndefined(messages) || _.isObject(messages) && !messages.singular) {
        throw new Error('You have to pass a messages object and define at least the singular message {singular:"Mandatory", plural:"Optional"}');
      }

      codes.forEach(function (code) {
        var msgId = options.id || route + '_' + options.method + '_' + code,
          callbackFactory = _getNotificationCallback(messages, msgId, options);

        if (_registeredIds.indexOf(msgId) > -1) {
          throw new Error('You can not define a second message for the route ' + route + ' and method ' + options.method + ' because you have already registered one!');
        } else {
          if(code==='SUCCESS' || code ==='ERROR'){
            delete options.statusCodes;
          } else {
            options.statusCodes = [code];
          }
          ResponseHandlerProvider.registerAction(route, callbackFactory, options);
          _registeredIds.push(msgId);
        }
      });

    };

    this.registerSuccessToast = function (route, messages, method, toastType, preProcessFn) {
      this.registerToast(route, messages, {
        method: method,
        toastType: toastType,
        onSuccess: true,
        preProcess: preProcessFn
      });
    };

    this.registerErrorToast = function (route, messages, method, toastType, preProcessFn) {
      this.registerToast(route, messages, {
        method: method,
        toastType: toastType,
        onError: true,
        preProcess: preProcessFn
      });
    };

    this.registerDefaultSuccessToast = function (messages, method, toastType, preProcessFn) {
      return this.registerToast('*', messages, {
        method: method,
        toastType: toastType,
        onSuccess: true,
        preProcess: preProcessFn
      });
    };

    this.registerDefaultErrorToast = function (messages, method, toastType, preProcessFn) {
      return this.registerToast('*', messages, {
        method: method,
        toastType: toastType,
        onError: true,
        preProcess: preProcessFn
      });
    };

    this.$get = function () {};

  });