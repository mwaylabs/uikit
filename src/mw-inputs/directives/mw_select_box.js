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

        var setBackboneModel = function (model) {
          if (scope.mwModelAttr) {
            scope.mwModel.set(scope.mwModelAttr, model.get(scope.mwOptionsKey));
          } else {
            scope.mwModel.set(model.toJSON());
          }
        };

        var unSetBackboneModel = function () {
          if (scope.mwModelAttr) {
            scope.mwModel.unset(scope.mwModelAttr);
          } else {
            scope.mwModel.clear();
          }
        };

        var setSelectedVal = function () {

          if (scope.mwModel.id) {
            scope.viewModel.selected = scope.mwModel.id.toString();
          }
        };

        var checkIfOptionModelHasId = function () {
          scope.mwOptionsCollection.each(function (model) {
            if (!model.id) {
              throw new Error('[mwSelectBox] Each model of the options collection must have an id. Make sure you set the correct model and modelId attribute!');
            }
          });
        };

        var unset = function () {
          unSetBackboneModel();
          scope.viewModel.selected = null;
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

        scope.hasPlaceholder = function () {
          return scope.mwPlaceholder || scope.mwRequired;
        };

        scope.getPlaceholder = function () {
          if (scope.mwPlaceholder) {
            return scope.mwPlaceholder;
          } else if (scope.mwRequired) {
            return i18n.get('mwSelectBox.pleaseSelect');
          }
        };

        scope.isOptionDisabled = function (model) {
          return model.selectable.isDisabled();
        };

        scope.getModelAttribute = function () {
          return scope.mwModelAttr || scope.mwModel.idAttribute;
        };

        scope.isChecked = function (model) {
          if (scope.mwModelAttr && scope.mwModel instanceof Backbone.Model) {
            return model.get(scope.mwOptionsKey) === scope.mwModel.get(scope.mwModelAttr);
          } else {
            return model.id === scope.mwModel.id;
          }
        };

        scope.select = function (id) {
          if (id) {
            scope.selectOption(scope.mwOptionsCollection.get(id));
          } else {
            unset();
          }
        };

        scope.selectOption = function (model) {
          if (!scope.isChecked(model)) {
            setBackboneModel(model);
          }
        };

        if (scope.mwModel) {
          if(!(scope.mwModel instanceof Backbone.Model)){
            throw new Error('[mwSelectBox] The attribute mw-model is from type '+typeof scope.mwModel+' but has to be a Backbone Model!');
          }

          scope.mwModel.on('change:' + scope.mwModel.idAttribute, setSelectedVal);
          setSelectedVal();

          scope.mwModel.on('change', function (model) {
            if ((scope.mwModelAttr && !model.get(scope.mwModelAttr)) || (!scope.mwModelAttr && !model.id)) {
              unset();
            }
          })
        }

        if (scope.mwModelAttr && !scope.mwOptionsKey) {
          throw new Error('[mwSelectBox] When using mwModelAttr the attribute mwOptionsKey is required!');
        }

        if (!scope.mwOptionsCollection || !(scope.mwOptionsCollection instanceof Backbone.Collection)) {
          throw new Error('[mwSelectBox] An options collection is required. Make sure you set the attribute mw-options-collection and that it is a backbone collection!');
        }

        checkIfOptionModelHasId();
        scope.mwOptionsCollection.on('add', checkIfOptionModelHasId);
      }
    };
  });