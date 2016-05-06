angular.module('mwUI.Utils')

  .provider('$exceptionHandler', function () {

    var _handlers = [];

    return {

      registerHandler: function(callback){
        _handlers.push(callback);
      },

      $get: function (callbackHandler, $log) {
        return function (exception,cause) {
          _handlers.forEach(function(callback){
            callbackHandler.exec(callback, [exception.toString(), cause.toString()]);
          });
          $log.error(exception);
        };
      }
    };

  });