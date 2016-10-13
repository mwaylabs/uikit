angular.module('mwUI.Form')

  .directive('ngModel', function () {
    return {
      require: ['ngModel', '?^ngModelErrors', '?^mwInputWrapper'],
      link: function (scope, el, attrs, ctrls) {
        var ngModelCtrl = ctrls[0],
          ngModelErrorsCtrl = ctrls[1],
          mwInputWrapperCtrl = ctrls[2],
          inputId = _.uniqueId('input_el');

        var setErrors = function (newErrorObj, oldErrorObj) {
          var newErrors = _.keys(newErrorObj),
            oldErrors = _.keys(oldErrorObj),
            removeErrors = _.difference(oldErrors, newErrors);

          ngModelErrorsCtrl.addErrorsForInput(newErrors, inputId, _.clone(attrs));
          ngModelErrorsCtrl.removeErrorsForInput(removeErrors, inputId, _.clone(attrs));
        };

        var setModelState = function () {
          mwInputWrapperCtrl.setModelState({
            dirty: ngModelCtrl.$dirty,
            valid: ngModelCtrl.$valid,
            touched: ngModelCtrl.$touched
          });
        };

        var initErrorState = function () {
          scope.$watch(function () {
            return ngModelCtrl.$error;
          }, function (newErrorObj, oldErrorObj) {
            setErrors(newErrorObj, oldErrorObj);
          }, true);
        };

        var initModelAndInputState = function () {
          scope.$watch(function () {
            return ngModelCtrl.$error;
          }, setModelState, true);

          scope.$watch(function () {
            return ngModelCtrl.$touched;
          }, setModelState);

          attrs.$observe('required', function(){
            mwInputWrapperCtrl.setInputState({
              required: angular.isDefined(el.attr('required'))
            });
          });

          el.on('focus blur', function(ev){
            mwInputWrapperCtrl.setInputState({
              focused: ev.type === 'focus'
            });
          });
          scope.$on('$destroy', el.off.bind(el));
        };

        if (ngModelErrorsCtrl) {
          initErrorState();
        }

        if(mwInputWrapperCtrl){
          initModelAndInputState();
        }
      }
    };

  });