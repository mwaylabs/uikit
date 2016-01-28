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
      templateUrl: 'uikit/templates/mwFormBb/mwFormMultiSelect.html',
      link: function (scope, el, attr, form) {
        scope.optionsKey = scope.mwOptionsKey || 'key';

        if (!(scope.collection instanceof window.mCAP.Collection)) {
          throw new Error('mwFormMultiSelect: collection attribute has to be a collection');
        }

        if (scope.disabledCollection && !(scope.disabledCollection instanceof window.mCAP.Collection)) {
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
      templateUrl: 'uikit/templates/mwFormBb/mwFormRadioGroup.html',
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
        mwPlaceholder: '@placeholder',
        mwNullLabel: '@',
        mwAutoFetch: '=',
        name: '@'
      },
      templateUrl: 'uikit/templates/mwFormBb/mwFormSelect.html',
      link: function (scope) {
        scope.optionsKey = scope.mwOptionsKey || 'key';

        scope.viewModel = {
          val: ''
        };

        //auto fetch is default true
        if ((scope.mwAutoFetch === true || scope.mwAutoFetch === undefined) && scope.mwOptionsCollection.length === 0) {
          scope.mwOptionsCollection.fetch();
        }

        scope.getKey = function (optionModel) {
          return optionModel.get(scope.optionsKey);
        };

        scope.getLabel = function (optionModel) {
          if (!scope.mwOptionsLabelI18nPrefix) {
            return optionModel.get(scope.mwOptionsLabelKey);
          }
          return i18n.get(scope.mwOptionsLabelI18nPrefix + '.' + scope.getKey(optionModel));
        };

        scope.getSelectedModel = function (val) {
          var searchObj = {};
          searchObj[scope.optionsKey] = val;
          return scope.mwOptionsCollection.findWhere(searchObj);
        };


        if(scope.mwModel instanceof window.Backbone.Model){
          scope.viewModel.val = scope.mwModel.get(scope.optionsKey);
          scope.mwOptionsCollection.on('add', function(){
            if(scope.viewModel.val && scope.getSelectedModel(scope.viewModel.val)){
              scope.mwModel.set(scope.getSelectedModel(scope.viewModel.val).toJSON());
            }
          });
        } else {
          scope.viewModel.val = scope.mwModel;
          scope.$watch('mwModel', function(val){
            scope.viewModel.val = val;
          });
        }

        scope.$watch('viewModel.val', function(val){
          if(scope.mwModel instanceof window.Backbone.Model){
            if(val && scope.getSelectedModel(val)){
              scope.mwModel.set(scope.getSelectedModel(val).toJSON());
            } else {
              scope.mwModel.clear();
            }
          } else {
            scope.mwModel = val;
          }
        });

        if (!scope.mwPlaceholder && scope.mwRequired) {
          if (scope.mwOptionsCollection.length > 0) {
            if (_.isUndefined(scope.mwModel) || _.isNull(scope.mwModel)) {
              scope.mwModel = scope.mwOptionsCollection.first().get(scope.optionsKey);
            }
          } else {
            scope.mwOptionsCollection.once('add', function (model) {
              if (_.isUndefined(scope.mwModel) || _.isNull(scope.mwModel)) {
                scope.mwModel = model.get(scope.optionsKey);
              }
            });
          }
        }
      }
    };
  })

  .directive('mwMultiSelectBoxes', function (i18n) {
    return {
      restrict: 'A',
      scope: {
        mwOptionsCollection: '=',
        mwCollection: '=',
        labelProperty: '@mwOptionsLabelKey',
        i18nPrefix: '@mwOptionsLabelI18nPrefix',
        mwRequired: '=',
        mwDisabled: '=',
        name: '@hiddenFormElementName',
        placeholder: '@'
      },
      templateUrl: 'uikit/templates/mwFormBb/mwMultiSelectBoxes.html',
      link: function (scope) {
        scope.viewModel = {
          tmpModel: new scope.mwCollection.model()
        };

        //add empty model on + button
        scope.add = function (model) {
          scope.mwCollection.add(model.toJSON());
        };

        //remove the specific model or the last (empty) one if model is not found
        scope.remove = function (model) {
          scope.mwCollection.remove(model);
        };

        //get label to show in select boxes
        scope.getLabel = function (model) {
          var label = scope.labelProperty ? model.get(scope.labelProperty) : model.get('key');
          if (scope.i18nPrefix) {
            return i18n.get(scope.i18nPrefix + '.' + label);
          }
        };

        scope.mwCollection.on('add', function(model){
          scope.mwOptionsCollection.remove(model);
        });

        scope.mwCollection.on('remove', function(model){
          scope.mwOptionsCollection.add(model.toJSON());
        });

        scope.mwCollection.each(function(model){
          scope.mwOptionsCollection.remove(model);
        });

      }
    };
  });
