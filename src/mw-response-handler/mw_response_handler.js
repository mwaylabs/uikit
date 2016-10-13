angular.module('mwUI.ResponseHandler', ['mwUI.Utils']);

// @include ./services/mw_response_handler.js

angular.module('mwUI.ResponseHandler')

  .config(function ($provide, $httpProvider) {

    $provide.factory('requestInterceptorForHandling', function ($q, ResponseHandler) {

      var handle = function(response, isError){
        var handler = ResponseHandler.handle(response, isError);
        if(handler){
          return handler;
        } else if(isError){
          return $q.reject(response);
        } else {
          return $q.when(response);
        }
      };

      return {
        response: function (response) {
          return handle(response, false);
        },
        responseError: function (response) {
          return handle(response, true);
        }
      };
    });

    $httpProvider.interceptors.push('requestInterceptorForHandling');

  });

