angular.module('mwUI.Inputs')

  .directive('mwCheckboxGroup', function (i18n) {
    return {
      restrict: 'A',
      scope: {
        mwCollection: '=',
        mwOptionsCollection: '=',
        mwOptionsLabelKey: '@',
        mwOptionsLabelI18nPrefix: '@',
        mwRequired: '=',
        mwDisabled: '='
      },
      templateUrl: 'uikit/mw-inputs/directives/templates/mw_checkbox_group.html',
      link: function (scope) {
        var getModelIdAttr = function () {
          return scope.mwCollection.model.prototype.idAttribute;
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

        scope.isSelected = function (model) {
          return !!scope.mwCollection.get(model.get(getModelIdAttr()));
        };

        scope.toggleModel = function (model) {
          var existingModel = scope.mwCollection.findWhere(model.toJSON());
          if (existingModel) {
            scope.mwCollection.remove(existingModel);
          } else {
            scope.mwCollection.add(model.toJSON());
          }
        };

        if (! (scope.mwCollection instanceof Backbone.Collection) ) {
          throw new Error('[mwCheckboxGroup] The attribute mwCollection is required and has to be an instanceof Backbone Collection');
        }

        if ( !(scope.mwOptionsCollection instanceof Backbone.Collection) ) {
          throw new Error('[mwCheckboxGroup] The attribute mwOptionsCollection is required and has to be an instanceof Backbone Collection');
        }
      }
    };
  });