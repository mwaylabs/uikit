'use strict';
window.mockException = function () {
  beforeEach(function () {
    module(function ($provide) {
      $provide.factory('$exceptionHandler', function ($log) {
        return function (exception, cause) {
          exception = exception || '';
          cause = cause || '';

          // Unhandled promise rejections are treated as Error in Angular 1.6
          // https://github.com/angular/angular.js/blob/v1.6.3/CHANGELOG.md#q-due-to
          // We don't want to display an exception modal for undhandled promise rejections
          if (_.isString(exception) && exception.match(/unhandled rejection/)) {
            console.warn(exception);
            return false;
          } else {
            $log.error(exception);
          }
        };
      });
    });
  });
};