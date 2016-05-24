angular.module('mwUI.Form')

  .directive('ngModel', function () {
    return {
      require: ['ngModel', '?^ngModelErrors', '?^mwInputWrapper'],
      link: function (scope, el, attrs, ctrls) {
        var ngModelCtrl = ctrls[0],
          ngModelErrorsCtrl = ctrls[1],
          mwInputWrapper = ctrls[2],
          inputId = _.uniqueId('input_el');

        var setErrors = function (newErrorObj, oldErrorObj) {
          var newErrors = _.keys(newErrorObj),
            oldErrors = _.keys(oldErrorObj),
            removeErrors = _.difference(oldErrors, newErrors);

          if (ngModelErrorsCtrl) {
            ngModelErrorsCtrl.addErrorsForInput(newErrors, inputId, _.clone(attrs));
            ngModelErrorsCtrl.removeErrorsForInput(removeErrors, inputId, _.clone(attrs));
          }
        };


        var setModelState = function () {
          if (mwInputWrapper) {
            mwInputWrapper.setModelState({
              dirty: ngModelCtrl.$dirty,
              valid: ngModelCtrl.$valid,
              touched: ngModelCtrl.$touched
            });
          }
        };

        var setInputState = function(){
          if (mwInputWrapper) {
            mwInputWrapper.setInputState({
              required: el.is(':required'),
              focused: el.is(':focus')
            });
          }
        };

        var init = function () {
          scope.$watch(function () {
            return ngModelCtrl.$error;
          }, function (newErrorObj, oldErrorObj) {
            setErrors(newErrorObj, oldErrorObj);
            setModelState();
          }, true);

          scope.$watch(function(){
            return ngModelCtrl.$touched;
          }, setModelState);

          attrs.$observe('required', setInputState);
          el.on('focus blur', setInputState);
          scope.$on('$destroy', el.off.bind(el));
        };

        if (ngModelErrorsCtrl) {
          init();
        }
      }
    };

  });