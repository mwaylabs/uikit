angular.module('mwUI.Inputs')

  .directive('mwSelectBox', function (i18n) {
    return {
      restrict: 'A',
      scope: {
        mwModel: '=',
        mwModelAttr: '@',
        mwOptionsCollection: '=',
        mwOptionsKey: '@',
        mwOptionsLabelKey: '@',
        mwOptionsLabelI18nPrefix: '@',
        mwPlaceholder: '@',
        mwRequired: '=',
        mwDisabled: '='
      },
      templateUrl: 'uikit/mw-inputs/directives/templates/mw_select_box.html',
      link: function (scope) {

        scope.viewModel = {};

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

        var setSelectedVal = function(){
          if(scope.mwModel.id){
            scope.viewModel.selected = scope.mwModel.id.toString();
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

        scope.hasPlaceholder = function(){
          return scope.mwPlaceholder || scope.mwRequired;
        };

        scope.getPlaceholder = function(){
          if(scope.mwPlaceholder){
            return scope.mwPlaceholder;
          } else if(scope.mwRequired){
            return i18n.get('mwSelectBox.pleaseSelect');
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

        scope.select = function(id){
          if(id){
            scope.selectOption(scope.mwOptionsCollection.get(id));
          } else {
            unSetBackboneModel();
          }
        };

        scope.selectOption = function (model) {
          if (!scope.isChecked(model)) {
            setBackboneModel(model);
          } else {
            unSetBackboneModel();
          }
        };

        if(scope.mwModel){
          scope.mwModel.on('change:'+scope.mwModel.idAttribute, setSelectedVal);
          setSelectedVal();
        }

        if(scope.mwModelAttr && !scope.mwOptionsKey){
          throw new Error('[mwRadioGroup] When using mwModelAttr the attribute mwOptionsKey is required!');
        }
      }
    };
  });