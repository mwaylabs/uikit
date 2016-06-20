angular.module('mwUI.Inputs')

  .directive('mwRadioGroup', function (i18n) {
    return {
      restrict: 'A',
      scope: {
        mwOptionsCollection: '=',
        mwOptionsKey: '@',
        mwOptionsLabelKey: '@',
        mwOptionsLabelI18nPrefix: '@',
        mwRequired: '=',
        mwDisabled: '='
      },
      require: '?ngModel',
      templateUrl: 'uikit/mw-inputs/directives/templates/mw_radio_group.html',
      link: function (scope, el, attr, ngModelCtrl) {
        if(!ngModelCtrl){
          return;
        }

        var getNgModelVal = function(){
          if(ngModelCtrl.$modelValue instanceof Backbone.Model){
            if(scope.mwOptionsKey){
              return ngModelCtrl.$modelValue.get(scope.mwOptionsKey);
            } else {
              return ngModelCtrl.$modelValue.get(ngModelCtrl.$modelValue.idAttribute);
            }
          } else {
            return ngModelCtrl.$modelValue;
          }
        };

        scope.getLabel = function(model){
          var modelAttr = model.get(scope.mwOptionsLabelKey);

          if(modelAttr){
            if(scope.mwOptionsLabelI18nPrefix){
              return i18n.get(scope.mwOptionsLabelI18nPrefix+'.'+modelAttr);
            } else {
              return modelAttr;
            }
          }
        };

        scope.isOptionDisabled = function(model){
          return model.selectable.isDisabled();
        };

        scope.isChecked = function(model){
          if(scope.mwOptionsKey){
            return model.get(scope.mwOptionsKey) === getNgModelVal();
          } else {
            return model.get(model.idAttribute) === getNgModelVal();
          }
        };

        scope.setNgModelVal = function(model){
          debugger;
          if(ngModelCtrl.$modelValue instanceof Backbone.Model){
            ngModelCtrl.$setViewValue(model.toJSON());
          } else if(scope.mwOptionsKey){
            ngModelCtrl.$setViewValue(model.get(scope.mwOptionsKey));
          } else {
            ngModelCtrl.$setViewValue(model.get(model.idAttribute));
          }
        };
      }
    };
  });