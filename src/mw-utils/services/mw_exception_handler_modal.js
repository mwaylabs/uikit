angular.module('mwUI.Utils')

  .provider('exceptionHandlerModal', function () {

    var showExceptionModal = true,
      options = {
        displayException: false,
        userCanEnterMessage: false,
        successCallback: null,
        errorCallback: null
      };

    return {

      disableExceptionModal: function () {
        showExceptionModal = false;
      },

      setModalOptions: function (opts) {
        _.extend(options, opts);
      },

      $get: function (callbackHandler, ExceptionModal) {

        var exceptionModal = new ExceptionModal();

        var hideNgView = function () {
          var ngView = angular.element.find('div[ng-view]');

          if (ngView) {
            angular.element(ngView).hide();
          }
        };

        return function (exception, cause) {
          if (showExceptionModal) {

            if (options.successCallback) {
              var succCb = options.successCallback;
              options.successCallback = function () {
                return callbackHandler.exec(succCb, [exception.toString(), cause.toString()]);
              };
            }

            if (options.errorCallback) {
              var errCb = options.errorCallback;
              options.errorCallback = function () {
                callbackHandler.exec(errCb, [exception.toString(), cause.toString()]);
              };
            }

            exceptionModal.setScopeAttributes(_.extend({}, options, {
              exception: exception.toString(),
              cause: cause
            }));

            hideNgView();
            exceptionModal.show();
          }
        };
      }
    };

  });