angular.module('mwUI.Inputs')

  .directive('mwRadioGroup', function (i18n) {
    return {
      restrict: 'A',
      scope: {
        mwModel: '=',
        mwModelAttr: '@',
        mwOptionsCollection: '=',
        mwOptionsKey: '@',
        mwOptionsLabelKey: '@',
        mwOptionsLabelI18nPrefix: '@',
        mwRequired: '=',
        mwDisabled: '='
      },
      templateUrl: 'uikit/mw-inputs/directives/templates/mw_radio_group.html',
      link: function (scope) {
        scope.radioGroupId = _.uniqueId('radio_');

        var setBackboneModel = function(model){
          if(scope.mwModelAttr){
            scope.mwModel.set(scope.mwModelAttr, model.get(scope.mwOptionsKey));
          } else {
            scope.mwModel.set(model.toJSON());
          }
        };

        var unSetBackboneModel = function(){
          if(scope.mwModelAttr){
            scope.mwModel.unset(scope.mwModelAttr);
          } else {
            scope.mwModel.clear();
          }
        };

        scope.getLabel = function (model) {
          var modelAttr = model.get(scope.mwOptionsLabelKey);

          if (modelAttr) {
            if (scope.mwOptionsLabelI18nPrefix) {
              return i18n.get(scope.mwOptionsLabelI18nPrefix + '.' + modelAttr);
            } else {
              return modelAttr;
            }
          }
        };

        scope.isOptionDisabled = function (model) {
          return model.selectable.isDisabled();
        };

        scope.getModelAttribute = function(){
          return scope.mwModelAttr || scope.mwModel.idAttribute;
        };

        scope.isChecked = function (model) {
          if(scope.mwModelAttr){
            return model.get(scope.mwOptionsKey) === scope.mwModel.get(scope.mwModelAttr);
          } else {
            return model.id === scope.mwModel.id;
          }
        };

        scope.selectOption = function (model) {
          if (!scope.isChecked(model)) {
            setBackboneModel(model);
          } else {
            unSetBackboneModel();
          }
        };

        if(scope.mwModelAttr && !scope.mwOptionsKey){
          throw new Error('[mwRadioGroup] When using mwModelAttr the attribute mwOptionsKey is required!');
        }
      }
    };
  });