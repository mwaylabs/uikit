'use strict';

angular.module('mwFormBb', [])

  .directive('mwFormMultiSelectBb', function () {
    return {
      restrict: 'A',
      transclude: true,
      require: '^?form',
      scope: {
        model: '=',
        collection: '=',
        mwOptionsKey: '@',
        translationPrefix: '@',
        mwRequired: '=',
        disabledCollection: '='
      },
      templateUrl: 'modules/ui/templates/mwFormBb/mwFormMultiSelect.html',
      link: function (scope, el, attr, form) {
        scope.optionsKey = scope.mwOptionsKey || 'key';

        if (!scope.collection instanceof window.mCAP.Collection) {
          throw new Error('mwFormMultiSelect: collection attribute has to be a collection');
        }

        if (scope.disabledCollection && !scope.disabledCollection instanceof window.mCAP.Collection) {
          throw new Error('mwFormMultiSelect: disabledCollection attribuet has to be a collection');
        }

        //When user unselects a checkbox it will be deleted from the model array
        var removeFromModel = function (key) {
          if (scope.model.indexOf(key) >= 0) {
            // Delete key from model array
            scope.model.splice(scope.model.indexOf(key), 1);
            // Delete model if no attribute is in there (for validation purposes)
            if (scope.model.length === 0) {
              delete scope.model;
            }
            return true;
          }
          return false;
        };

        if (scope.disabledCollection) {
          //if a an item is in the disabledCollection it will be removed from the model
          scope.disabledCollection.each(function (disabledModel) {
            removeFromModel(disabledModel.get(scope.optionsKey));
          });
        }

        scope.isDisabled = function (model) {
          if (scope.disabledCollection) {
            return !!scope.disabledCollection.get(model);
          }
        };

        scope.toggleKeyIntoModelArray = function (key) {
          scope.model = scope.model || [];
          if (!removeFromModel(key)) {
            scope.model.push(key);
          }
        };

        scope.showRequiredMessage = function () {
          return ( (!scope.model || scope.model.length < 1) && scope.mwRequired);
        };

        scope.setDirty = function () {
          if (form) {
            form.$setDirty();
          }
        };
      }
    };
  })

  .directive('mwFormRadioGroupBb', function () {
    return {
      restrict: 'A',
      transclude: true,
      require: '^?form',
      scope: {
        mwModel: '=',
        mwOptionsCollection: '=',
        mwOptionsKey: '@',
        mwOptionsLabelKey: '@',
        mwOptionsLabelI18nPrefix: '@',
        mwRequired: '=',
        mwDisabled: '=',
        name: '@'
      },
      templateUrl: 'modules/ui/templates/mwFormBb/mwFormRadioGroup.html',
      link: function (scope) {
        scope.optionsKey = scope.mwOptionsKey || 'key';

        if (scope.mwOptionsCollection.length === 0) {
          scope.mwOptionsCollection.fetch();
        }
      }
    };
  })

  .directive('mwFormSelectBb', function (i18n) {
    return {
      restrict: 'A',
      transclude: true,
      require: '^?form',
      scope: {
        mwModel: '=',
        mwOptionsCollection: '=',
        mwOptionsKey: '@',
        mwOptionsLabelKey: '@',
        mwOptionsLabelI18nPrefix: '@',
        mwRequired: '=',
        mwDisabled: '=',
        mwChange: '&',
        name: '@',
        placeholder: '@'
      },
      templateUrl: 'modules/ui/templates/mwFormBb/mwFormSelect.html',
      link: function (scope) {
        scope.optionsKey = scope.mwOptionsKey || 'key';

        if (scope.mwOptionsCollection.length === 0) {
          scope.mwOptionsCollection.fetch();
        }

        scope.change = function () {

        };

        scope.getKey = function (optionModel) {
          return optionModel.get(scope.optionsKey);
        };

        scope.getLabel = function (optionModel) {
          return i18n.get(scope.mwOptionsLabelI18nPrefix + '.' + scope.getKey(optionModel));
        };
      }
    };
  })

  .directive('mwMultiSelectBoxes', function (i18n) {
    return {
      restrict: 'A',
      scope: {
        inputCollection: '=mwOptionsCollection',
        selectedCollection: '=mwCollection',
        labelProperty: '@mwOptionsLabelKey',
        i18nPrefix: '@mwOptionsLabelI18nPrefix',
        mwRequired: '=',
        mwDisabled: '=',
        name: '@hiddenFormElementName'
      },
      templateUrl: 'modules/ui/templates/mwFormBb/mwMultiSelectBoxes.html',
      link: function (scope) {

        //init collection with given values or one empty model if no data is provided
        scope.privateCollection = scope.selectedCollection.clone();
        if (scope.privateCollection.length === 0) {
          var emptyClone = scope.inputCollection.first().clone().clear();
          scope.privateCollection.add(emptyClone);
        }

        //add empty model on + button
        scope.add = function () {
          var emptyClone = scope.inputCollection.first().clone().clear();
          scope.privateCollection.add(emptyClone);
        };

        //remove the specific model or the last (empty) one if model is not found
        scope.remove = function (model) {
          correctIds();
          if (!model.id) {
            scope.privateCollection.pop();
          }
          scope.privateCollection.remove(scope.privateCollection.get(model.id));
          if (scope.privateCollection.length === 0) {
            scope.add();
          }
          scope.change();
        };

        //only show the available models in options
        scope.collectionWithoutSelected = function (model) {
          //the current selected model should not be removed from the options
          var notInOptionsCollection = scope.privateCollection.clone();
          notInOptionsCollection.remove(model);

          //remove all already chosen models from options
          var filteredOptionsCollection = scope.inputCollection.clone();
          filteredOptionsCollection.remove(notInOptionsCollection.models);
          return filteredOptionsCollection;
        };

        //reset selected collection on every change
        scope.change = function () {
          scope.selectedCollection.reset(scope.privateCollection.models, {silent: true});
          scope.selectedCollection.each(function (model) {
            if (!model.id) {
              scope.selectedCollection.pop();
            }
          });
          scope.requiredValue = scope.selectedCollection.length ? true : null;
        };

        //get label to show in select boxes
        scope.getLabel = function (model) {
          var label = scope.labelProperty ? model.get(scope.labelProperty) : model.get('key');
          if (scope.i18nPrefix) {
            return i18n.get(scope.i18nPrefix + '.' + label);
          }
        };

        //helper method to reset the collections ids (we need this because the ng-model of the select directly replaces the model
        //and does not use the collections set function
        var correctIds = function () {
          var byId = {};
          scope.privateCollection.each(function (model) {
            byId[model.id] = model;
          });
          scope.privateCollection._byId = byId;
        };

        scope.change();
      }
    };
  })

  .directive('mwMultiSelectBox', function () {
    return {
      restrict: 'A',
      templateUrl: 'modules/ui/templates/mwFormBb/mwMultiSelectBox.html'
    };
  });
