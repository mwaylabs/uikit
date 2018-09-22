angular.module('mwUI.ExceptionHandler')

  .provider('$exceptionHandler', function () {

    var _handlers = [];

    return {

      registerHandler: function (callback) {
        _handlers.push(callback);
      },

      $get: function (callbackHandler, $log) {
        return function (exception, cause) {
          exception = exception || '';
          cause = cause || '';

          // Unhandled promise rejections are treated as Error in Angular 1.6
          // https://github.com/angular/angular.js/blob/v1.6.3/CHANGELOG.md#q-due-to
          // We don't want to display an exception modal for undhandled promise rejections
          if (_.isString(exception) && exception.match(/unhandled rejection/)) {
            console.warn(exception);
            return false;
          }

          try {
            _handlers.forEach(function (callback) {
              callbackHandler.exec(callback, [exception.toString(), cause.toString()]);
            });
          } catch (err) {
            $log.error(err);
          }
          $log.error(exception);
        };
      }
    };

  });