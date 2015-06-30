'use strict';

angular.module('mwToast', [])

  .directive('mwToasts', function (Toast) {
    return {
      templateUrl: 'modules/ui/templates/mwToast/mwToasts.html',
      link: function (scope) {
        scope.toasts = Toast.getToasts();

        scope.hideToast = function (toast) {
          Toast.removeToast(toast);
        };

      }
    };
  })

  .provider('Toast', function () {

    var _autoHideTime = 5000,
      _toasts = [];

    var Toast = function (message, options) {
      options = options || {};
      options.button = options.button || {};

      var replaceMessage = function (newMessage) {
        toast.message = newMessage;
        toast.replaceCount++;
        resetAutoHideTimer();
      };

      var setAutoHideCallback = function(fn){
        toast.autoHideCallback = fn;
        resetAutoHideTimer();
      };

      var resetAutoHideTimer = function () {
        if(_autoRemoveTimeout){
          window.clearTimeout(_autoRemoveTimeout);
        }
        startAutoHideTimer();
      };

      var startAutoHideTimer = function () {
        if (toast.autoHide) {
          _autoRemoveTimeout = window.setTimeout(function () {
            if (toast.autoHideCallback && typeof toast.autoHideCallback === 'function') {
              toast.visible = false;
              toast.autoHideCallback.apply(this, arguments);
            }
          }.bind(this), toast.autoHideTime);
        }
      };

      var toast = {
          id: options.id || _.uniqueId('toast'),
          type: options.type || 'default',
          visible: true,
          message: message,
          autoHide: options.autoHide || false,
          autoHideTime: options.autoHideTime || 5000,
          autoHideCallback: options.autoHideCallback,
          isHtmlMessage: options.isHtmlMessage,
          button: {
            title: options.button.title,
            link: options.button.link,
            isLink: !!options.button.link,
            action: options.button.action
          },
          replaceMessage: replaceMessage,
          replaceCount: 0,
          setAutoHideCallback: setAutoHideCallback
        },
        _autoRemoveTimeout;

      startAutoHideTimer();

      return toast;
    };

    this.setAutoHideTime = function(timeInMs){
      _autoHideTime = timeInMs;
    };

    this.$get = function ($timeout) {

      return {
        findToast: function (id) {
          var toastContainer = _.findWhere(_toasts, {id: id});
          if(toastContainer){
            return toastContainer.toast;
          } else {
            return false;
          }
        },
        getToasts: function () {
          return _.pluck(_toasts, 'toast');
        },
        replaceToast: function (toast, message) {

          var toast = this.findToast(toast.id);

          if (toast) {
            toast.replaceMessage(message);
          }

          return toast;
        },
        removeToast: function (toast) {
          var match = this.findToast(toast),
            index = _.indexOf(_toasts, match);
          if (index) {
            _toasts.splice(index, 1);
          }
          return !!index;
        },
        addToast: function (message, options) {
          options = options || {};

          options.autoHideTime = options.autoHideTime || _autoHideTime;

          var existingToast = this.findToast(options.id);

          if(existingToast){
            this.replaceToast(existingToast, message);
          } else {
            var toast = new Toast(message, options);

            var removeFn = function () {
              $timeout(function () {
                if (options.autoHideCallback && typeof options.autoHideCallback === 'function') {
                  options.autoHideCallback.apply(this, arguments);
                }
                this.removeToast(toast);
              });
            }.bind(this);

            toast.setAutoHideCallback(removeFn);

            _toasts.push({id: toast.id, toast: toast});
          }
        }
      };
    };
  });