angular.module('mwUI.Form')

  .directive('mwSetDirtyOnModelChange', function () {
    return {
      require: 'ngModel',
      link: function (scope, el, attrs, ngModelCtrl) {
        ngModelCtrl.$validators.valueWatcher = function (val) {
          if (val !== void(0) && val !== null) {
            ngModelCtrl.$setDirty();
            ngModelCtrl.$setTouched();
          } else {
            ngModelCtrl.$setPristine();
          }
          return val;
        };
      }
    };
  });