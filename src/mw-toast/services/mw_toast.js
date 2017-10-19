'use strict';

angular.module('mwUI.Toast')

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
      };

      toast.replaceMessage = function (newMessage) {
        toast.message = newMessage;
        toast.replaceCount++;
      };

      return toast;
    };

    this.setAutoHideTime = function (timeInMs) {
      _autoHideTime = timeInMs;
    };

    this.setDefaultIcons = function (obj) {
      _.extend(_defaultIcons, obj);
    };

    this.$get = function ($timeout, mwScheduler) {

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
          mwScheduler.reset();
        },
        getToasts: function () {
          return _.pluck(_toasts, 'toast');
        },
        replaceToastMessage: function (id, message) {

          var toast = this.findToast(id);

          if (toast) {
            toast.replaceMessage(message);
            var existingTask = mwScheduler.get(toast.id);
            if (existingTask) {
              existingTask.resetTime();
            }
          }

          return toast;
        },
        removeToast: function (id) {
          var existingToast = _.findWhere(_toasts, {id: id}),
            index = _.indexOf(_toasts, existingToast);

          if (existingToast) {
            mwScheduler.remove(mwScheduler.get(existingToast.id));
            $timeout(function () {
              _toasts.splice(index, 1);
            });
          }

          return existingToast;
        },
        addToast: function (message, options) {
          options = options || {};

          options.autoHideTime = options.autoHideTime || _autoHideTime;

          var existingToast = this.findToast(options.id);

          if (existingToast) {
            this.replaceToastMessage(existingToast.id, message);
          } else {
            var toast = new Toast(message, options);

            if (toast.autoHide) {
              mwScheduler.add(function () {
                if (options.autoHideCallback && typeof options.autoHideCallback === 'function') {
                  options.autoHideCallback.apply(this, arguments);
                }
                this.removeToast(toast.id);
              }, toast.autoHideTime, toast.id, this);
            }

            _toasts.push({id: toast.id, toast: toast});

            return toast;
          }
        }
      };
    };
  });
