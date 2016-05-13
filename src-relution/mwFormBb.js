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

        if (!(scope.collection instanceof Backbone.Collection)) {
          throw new Error('mwFormMultiSelect: collection attribute has to be a collection');
        }

        if (scope.disabledCollection && !(scope.disabledCollection instanceof Backbone.Collection)) {
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
        mwOptionsKey: '@',            //defines option attribute as _the value_ - optional. if undefined, assumes "key" as key value
        mwOptionsLabelKey: '@',       //defines option attribute as _the label_
        mwOptionsLabelI18nPrefix: '@',//defines a directory for i18n texts as _the label_ - optional
        mwRequired: '=',              //determines, if a selection is required - optional, disables the _null option_
        mwDisabled: '=',              //determines, if the select-box is disabled
        mwChange: '&',
        mwPlaceholder: '@placeholder',
        mwNullLabel: '@',             //defines a string as _the label_ for _the null option_ - optional, only effective, if selection not required (mwRequired = false)
        mwAutoFetch: '=',
        name: '@'
      },
      templateUrl: 'uikit/templates/mwFormBb/mwFormSelect.html',
      link: function (scope) {
        //if the optional options and label key are not set, specify a default value
        scope.optionsKey = scope.mwOptionsKey || 'key';
        scope.labelKey = scope.mwOptionsLabelKey || 'label';

        scope.viewModel = {
          val: ''
        };

        scope.getKey = function (optionModel) {
          return optionModel.get(scope.optionsKey);
        };

        scope.getLabel = function (optionModel) {
          //if a null option exists, label is the label key (specified in addNullOption)
          if(optionModel.get(scope.optionsKey) === null){
            return optionModel.get(scope.labelKey);
          } else { //for any other option, first check if label can be [i18n-prefix + optionsKey]...
            if(scope.mwOptionsLabelI18nPrefix){
              return i18n.get(scope.mwOptionsLabelI18nPrefix + '.' + scope.getKey(optionModel));
            } else { //...else label is, what get key returns (specified or default options key)
              return scope.getKey(optionModel);
            }
          }
        };

        scope.getSelectedModel = function (val) {
          var searchObj = {};

          searchObj[scope.optionsKey] = val;
          return scope.mwOptionsCollection.findWhere(searchObj);
        };

        var addNullOption = function () {
          if (!scope.mwRequired) {
            var nullOption = {},
                key = null,
                referenceObj = {};
            //create the null-option-object and a reference object with just the options-key
            referenceObj[scope.optionsKey] = key;
            nullOption[scope.optionsKey] = key;
            nullOption[scope.labelKey] = scope.mwNullLabel || '';

            //if the collection already contains a null Option, we don't override it.
            //By checking for the reference object, it just scans the collection for the options key
            if (!scope.mwOptionsCollection.findWhere(referenceObj)) {
              scope.mwOptionsCollection.add(nullOption);
            }
          }
        };

        if (scope.mwModel instanceof window.Backbone.Model) {
          // We need set it to null when it is undefined so the added null object will be selected
          scope.viewModel.val = scope.mwModel.get(scope.optionsKey) || null;
          scope.mwOptionsCollection.on('add', function () {
            if (scope.viewModel.val && scope.getSelectedModel(scope.viewModel.val)) {
              scope.mwModel.set(scope.getSelectedModel(scope.viewModel.val).toJSON());
            }
          });
          scope.$watch('viewModel.val', function (val) {
            if (val && scope.getSelectedModel(val)) {
              scope.mwModel.set(scope.getSelectedModel(val).toJSON());
            } else {
              scope.mwModel.clear();
            }
          });
        } else {
          // We need set it to null when it is undefined so the added null object will be selected
          scope.viewModel.val = scope.mwModel || null;
          scope.$watch('mwModel', function (val) {
            if (val || val === null) {
              scope.viewModel.val = val;
            }
          });
          scope.$watch('viewModel.val', function (val) {
            scope.mwModel = val;
          });
        }

        //auto fetch is default true
        if ((scope.mwAutoFetch || angular.isUndefined(scope.mwAutoFetch)) && scope.mwOptionsCollection.length === 0) {
          scope.mwOptionsCollection.fetch();
        }

        if (!scope.mwRequired) {
          //We are adding a null object so we can use a placeholder and a null option
          //It is not possible to use 2 options in ng-select when ng-options is in use
          //So we have to add it to the collection
          addNullOption();
          scope.mwOptionsCollection.on('reset sync', addNullOption, this);
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

        scope.mwCollection.on('add', function (model) {
          scope.mwOptionsCollection.remove(model);
        });

        scope.mwCollection.on('remove', function (model) {
          scope.mwOptionsCollection.add(model.toJSON());
        });

        scope.mwCollection.each(function (model) {
          scope.mwOptionsCollection.remove(model);
        });

      }
    };
  });
