angular.module('mwUI.ExceptionHandler')

  .provider('$exceptionHandler', function () {

    var _handlers = [];

    return {

      registerHandler: function(callback){
        _handlers.push(callback);
      },

      $get: function (callbackHandler, $log) {
        return function (exception,cause) {
          exception = exception || '';
          cause = cause || '';

          try{
            _handlers.forEach(function(callback){
              callbackHandler.exec(callback, [exception.toString(), cause.toString()]);
            });
          } catch (err){
            $log.error(err);
          }

          $log.error(exception);
        };
      }
    };

  });