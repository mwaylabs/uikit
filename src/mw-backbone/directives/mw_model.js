angular.module('mwUI.Backbone')

  .directive('mwModel', function () {
    return {
      require: '?ngModel',
      link: function (scope, el, attrs, ngModelCtrl) {
        var model, modelAttr;

        var updateNgModel = function () {
          var val = model.get(modelAttr);

          ngModelCtrl.$formatters.forEach(function (formatFn) {
            val = formatFn(val);
          });

          ngModelCtrl.$setViewValue(val);
          ngModelCtrl.$render();
        };

        var updateBackboneModel = function () {
          var obj = {};

          obj[modelAttr] = ngModelCtrl.$modelValue;
          model.set(obj, {fromNgModel: true});
        };

        var getModelAttrName = function () {
          var mwModelAttrOption = attrs.mwModelAttr,
            mwModelAttrFromNgModel = attrs.ngModel;

          if (mwModelAttrOption && mwModelAttrOption.length > 0) {
            return mwModelAttrOption;
          } else if (angular.isUndefined(mwModelAttrOption) && mwModelAttrFromNgModel) {
            return mwModelAttrFromNgModel.split('.').pop();
          }
        };

        var init = function () {
          model = scope.$eval(attrs.mwModel);
          modelAttr = getModelAttrName();

          if (ngModelCtrl && model && modelAttr) {

            model.on('change:' + modelAttr, function (model, val, options) {
              if (!options.fromNgModel) {
                updateNgModel();
              }
            });

            ngModelCtrl.$viewChangeListeners.push(updateBackboneModel);
            ngModelCtrl.$parsers.push(function (val) {
              updateBackboneModel();
              return val;
            });

            if (model.get(modelAttr) && ngModelCtrl.$modelValue && model.get(modelAttr) !== ngModelCtrl.$modelValue) {
              throw new Error('The ng-model and the backbone model can not have different values during initialization!');
            } else if (model.get(modelAttr)) {
              updateNgModel();
            } else if (ngModelCtrl.$modelValue) {
              updateBackboneModel();
            }
          }
        };

        if (scope.mwModel && getModelAttrName()) {
          init();
        } else {
          var offModel = scope.$watch('mwModel', function () {
            offModel();
            init();
          });

          var offModelAttr = scope.$watch('mwModelAttr', function () {
            offModelAttr();
            init();
          });
        }
      }
    };
  });