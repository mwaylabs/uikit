angular.module('mwUI.Backbone')

  .directive('mwModel', function () {
    return {
      require: '?ngModel',
      link: function (scope, el, attrs, ngModel) {
        var model, modelAttr;

        var updateNgModel = function () {
          var val = model.get(modelAttr);

          ngModel.$formatters.forEach(function (formatFn) {
            val = formatFn(val);
          });

          ngModel.$setViewValue(val);
          ngModel.$render();
        };

        var updateBackboneModel = function () {
          var obj = {};

          obj[modelAttr] = ngModel.$modelValue;
          model.set(obj, {fromNgModel: true});
        };

        var init = function () {
          model = scope.$eval(attrs.mwModel);
          modelAttr = attrs.ngModel.split('.');
          modelAttr = modelAttr[modelAttr.length-1];

          if (model) {
            updateNgModel();
            model.on('change:' + modelAttr, function (model, val, options) {
              if (!options.fromNgModel) {
                updateNgModel();
              }
            });

            ngModel.$viewChangeListeners.push(updateBackboneModel);
            ngModel.$parsers.push(function (val) {
              updateBackboneModel();
              return val;
            });
          }
        };

        if (ngModel) {
          if (scope.mwModel) {
            init();
          } else {
            var off = scope.$watch('mwModel', function () {
              off();
              init();
            });
          }
        }
      }
    };
  });