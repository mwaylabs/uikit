angular.module('mwUI.Backbone')

  .directive('mwModel', function () {
    return {
      require: '?ngModel',
      link: function (scope, el, attrs, ngModel) {
        var model, modelAttr;

        var updateNgModel = function () {
          var val = model.get(modelAttr);

          debugger;
          ngModel.$formatters.forEach(function (formatFn) {
            val = formatFn(val);
          });

          ngModel.$setViewValue(val);
          ngModel.$render();
        };

        var updateBackboneModel = function () {
          var obj = {};
          debugger;
          if(model.get(modelAttr) instanceof Backbone.Model){
            if(ngModel.$modelValue && ngModel.$modelValue instanceof Backbone.Model){
              obj = ngModel.$modelValue.toJSON();
            } else if(angular.isObject(ngModel.$modelValue)){
              obj = ngModel.$modelValue;
            } else {
              //obj[modelAttr] = ngModel.$modelValue;
            }
            model.get(modelAttr).set(obj,{fromNgModel: true});
          } else {
            obj[modelAttr] = ngModel.$modelValue;
            model.set(obj, {fromNgModel: true});
          }
        };

        var getModelAttrName = function(){
          var mwModelAttrOption = attrs.mwModelAttr,
              mwModelAttrFromNgModel = attrs.ngModel;

          if(mwModelAttrOption && mwModelAttrOption.length>0){
            return mwModelAttrOption
          } else if(angular.isUndefined(mwModelAttrOption) && mwModelAttrFromNgModel){
            return mwModelAttrFromNgModel.split('.').pop();
          }
        };

        var init = function () {
          model = scope.$eval(attrs.mwModel);
          modelAttr = getModelAttrName();

          if (model && modelAttr) {
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

            if(model.get(modelAttr) && ngModel.$modelValue&& model.get(modelAttr) !== ngModel.$modelValue){
              throw new Error('The ng-model and the backbone model can not have different values during initialization!');
            } else if (model.get(modelAttr)) {
              updateNgModel();
            } else if (ngModel.$modelValue) {
              updateBackboneModel();
            }
          }
        };

        if (ngModel) {
          if (scope.mwModel && getModelAttrName()) {
            init();
          } else {
            var offModel = scope.$watch('mwModel', function (val) {
              offModel();
              init();
            });

            var offModelAttr = scope.$watch('mwModelAttr', function (val) {
              offModelAttr();
              init();
            });
          }
        }
      }
    };
  });