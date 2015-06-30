/**
 * Created by zarges on 23/06/15.
 */
'use strict';
angular.module('mwResponseToastHandler', ['mwResponseHandler', 'mwI18n', 'mwToast'])

  .provider('ResponseToastHandler', function ($provide, ResponseHandlerProvider) {
    var _registeredIds = [],
      _registeredToastOptions = {
        DEFAULT: {
          type: 'default',
          autoHide: false
        }
      };

    var _getNoftificationCallback = function (messages, id, options) {
      options = options || {};
      var factoryName = _.uniqueId('notification_factory');
      $provide.factory(factoryName, ['Toast', 'i18n', function (Toast, i18n) {
        return function (response) {
          if(!messages){
            return;
          }

          var prevToast = Toast.findToast(id),
            data = response.data || {},
            messageStr = prevToast ? messages.plural : messages.singular,
            message,
            toastOptions = {
              id: id
            };

          data.$count = prevToast ? prevToast.replaceCount+1 : 0;
          data.$count++;

          if(options.preProcess && typeof options.preProcess=== 'function'){
            message = options.preProcess.call(this, messageStr, data, i18n);
          } else {
            if(data.results && data.results.length > 0 ){
              data = data.results[0];
            }
            message = i18n.get(messageStr, data);
          }

          if(options.toastType){
            var opts = _registeredToastOptions[options.toastType];
            if(opts){
              _.extend(toastOptions, opts);
            } else {
              throw new Error('Type '+options.toastType+' is not available. Make sure you have configured it first')
            }
          } else {
            _.extend(toastOptions, _registeredToastOptions.DEFAULT);
          }

          Toast.addToast(message, toastOptions);
        };
      }]);
      return factoryName;
    };

    this.registerToastType = function(typeId, toastOptions){
      if(_registeredToastOptions[typeId]){

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
          callbackFactory = _getNoftificationCallback(messages, msgId, options);

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
    };

    this.$get = function () {};

  });