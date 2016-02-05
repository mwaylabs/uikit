'use strict';

angular.module('mwToast', [])

  .directive('mwToasts', function (Toast) {
    return {
      templateUrl: 'uikit/templates/mwToast/mwToasts.html',
      link: function (scope) {
        scope.toasts = Toast.getToasts();

        scope.$watch(function () {
          return Toast.getToasts().length;
        }, function () {
          scope.toasts = Toast.getToasts();
        });

        scope.hideToast = function (toastId) {
          Toast.removeToast(toastId);
        };

      }
    };
  })

  .provider('Toast', function () {

    var _autoHideTime = 5000,
      _toasts = [],
      _defaultIcons = {
        primary: 'fa-flag-o',
        info: 'fa-info',
        success: 'fa-check',
        warning: 'fa-warning',
        danger: 'fa-exclamation'
      };

    var Toast = function (message, options) {
      options = options || {};
      options.button = options.button || {};

      var toast = {
          id: options.id || _.uniqueId('toast'),
          type: options.type || 'default',
          visible: true,
          message: message,
          title: options.title,
          autoHide: options.autoHide || false,
          autoHideTime: options.autoHideTime || 5000,
          autoHideCallback: options.autoHideCallback,
          isHtmlMessage: options.isHtmlMessage,
          icon: options.icon || _defaultIcons[options.type] || 'fa-info',
          button: {
            title: options.button.title,
            link: options.button.link,
            target: options.button.target,
            isLink: options.button.isLink || !!options.button.link,
            action: options.button.action
          },
          replaceCount: 0,
          initDate: +new Date()
        },
        _autoRemoveTimeout;

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

      var resetAutoHideTimer = function () {
        if (_autoRemoveTimeout) {
          window.clearTimeout(_autoRemoveTimeout);
        }
        startAutoHideTimer();
      };

      var setAutoHideCallback = function (fn) {
        toast.autoHideCallback = fn;
        resetAutoHideTimer();
      };

      var replaceMessage = function (newMessage) {
        toast.message = newMessage;
        toast.replaceCount++;
        resetAutoHideTimer();
      };

      toast.replaceMessage = replaceMessage;
      toast.setAutoHideCallback = setAutoHideCallback;


      startAutoHideTimer();

      return toast;
    };

    this.setAutoHideTime = function (timeInMs) {
      _autoHideTime = timeInMs;
    };

    this.setDefaultIcons = function(obj){
      _.extend(_defaultIcons,obj);
    };

    this.$get = function ($timeout) {

      return {
        findToast: function (id) {
          var toastContainer = _.findWhere(_toasts, {id: id});
          if (toastContainer) {
            return toastContainer.toast;
          } else {
            return false;
          }
        },
        clear: function () {
          _toasts = [];
        },
        getToasts: function () {
          return _.pluck(_toasts, 'toast');
        },
        replaceToastMessage: function (id, message) {

          var toast = this.findToast(id);

          if (toast) {
            toast.replaceMessage(message);
          }

          return toast;
        },
        removeToast: function (id) {
          var match = _.findWhere(_toasts, {id: id}),
            index = _.indexOf(_toasts, match);

          if (match) {
            _toasts.splice(index, 1);
          }

          return match;
        },
        addToast: function (message, options) {
          options = options || {};

          options.autoHideTime = options.autoHideTime || _autoHideTime;

          var existingToast = this.findToast(options.id);

          if (existingToast) {
            this.replaceToastMessage(existingToast.id, message);
          } else {
            var toast = new Toast(message, options);

            var removeFn = function () {
              $timeout(function () {
                if (options.autoHideCallback && typeof options.autoHideCallback === 'function') {
                  options.autoHideCallback.apply(this, arguments);
                }
                this.removeToast(toast.id);
              }.bind(this));
            }.bind(this);

            toast.setAutoHideCallback(removeFn);

            _toasts.push({id: toast.id, toast: toast});

            return toast;
          }
        }
      };
    };
  });
