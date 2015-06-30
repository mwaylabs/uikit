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
      var msgId = options.id || route + '_' + options.method,
        callbackFactory = _getNoftificationCallback(messages, msgId, options);

      if(_registeredIds.indexOf(msgId)>-1){
        throw new Error('You can not define a second message for the route '+route+' and method '+ options.method + ' because you have already registered one!');
      } else {
        _registeredIds.push(msgId);
        return ResponseHandlerProvider.registerAction(route, callbackFactory, options);
      }
    };

    this.$get = function () {};

  });