'use strict';

(function () {

  // Common used function to put defaults onto some HTML elements
  var extendHTMLElement = function () {
    return {
      restrict: 'E',
      require: '?^mwFormInput',
      link: function (scope, elm, attr, ctrl) {
        var formInputController = ctrl,
          skipTheFollowing = ['checkbox', 'radio'],
          dontSkipIt = skipTheFollowing.indexOf(attr.type) === -1;

        // Add default class coming from bootstrap
        if (dontSkipIt) {
          elm.addClass('form-control');
        }

        //append validation messages to element
        if (dontSkipIt && formInputController) {
          formInputController.buildValidationMessages(elm);
        }
      }
    };
  };

  var addDefaultValidations = function () {
    return {
      restrict: 'E',
      require: '?ngModel',
      link: function (scope, elm, attr, ctrl) {

        var ngModelController = ctrl,
          skipTheFollowing = ['checkbox', 'radio', 'hidden', 'file'],
          dontSkipIt = skipTheFollowing.indexOf(attr.type) === -1,
          _maxlength = 255, // for input fields of all types
          _maxIntValue = 2147483647;

        // use higher maxLength for textareas
        if (!attr.type) {
          _maxlength = 4000;
        }

        // Don't overwrite existing values for ngMaxlength
        if (attr.type !== 'number' && ngModelController && dontSkipIt && !ngModelController.$validators.maxlength) {
          attr.$set('ngMaxlength', _maxlength);
          ngModelController.$validators.maxlength = function (modelValue, viewValue) {
            return (_maxlength < 0) || ngModelController.$isEmpty(modelValue) || (viewValue.length <= _maxlength);
          };
        }

        //set max value for number fields
        if (attr.type === 'number' && !ctrl.$validators.max) {
          attr.$set('max', _maxIntValue);
          ctrl.$validators.max = function (value) {
            return ctrl.$isEmpty(value) || angular.isUndefined(_maxIntValue) || value <= _maxIntValue;
          };
        }
      }
    };
  };


  angular.module('mwForm', [])

  /**
   * @ngdoc directive
   * @name mwForm.directive:mwFormInput
   * @element div
   * @description
   *
   * Wrapper for input elements. Adds validation messages, form HTML and corresponding CSS.
   * The following elements can register itself on mwFormInput:
   *
   * - select
   * - input[text]
   * - textarea
   *
   * @scope
   *
   * @param {string} label Label to show
   * @param {expression} hideErrors If true, doesn't show validation messages. Default is false
   *
   */
    .directive('mwFormInput', function (i18n) {
      return {
        restrict: 'A',
        transclude: true,
        scope: {
          label: '@',
          tooltip: '@',
          hideErrors: '=',
          validateWhenDirty: '='
        },
        templateUrl: 'modules/ui/templates/mwForm/mwFormInput.html',
        link: function (scope, elm) {
          scope.isInvalid = function () {
            var ctrl = elm.inheritedData('$formController'),
              invalid = false;
            if (scope.elementName && ctrl && ctrl[scope.elementName]) {
              invalid = ctrl[scope.elementName].$invalid;
            }
            return invalid;
          };

          scope.isDirty = function () {
            var ctrl = elm.inheritedData('$formController');
            return ctrl ? ctrl.$dirty : false;
          };

          scope.$watch('elementName', scope.isInvalid);
        },
        controller: function ($scope) {
          var that = this;
          that.element = null;

          this.buildValidationMessages = function (element) {
            if (!that.element) {
              that.element = element;

              $scope.$watch(function () {
                return element.attr('name');
              }, function (val) {
                if (val) {
                  $scope.elementName = val;
                }
              });

              var buildValidationValues = function () {
                $scope.validationValues = {
                  required: i18n.get('errors.isRequired'),
                  email: i18n.get('errors.hasToBeAnEmail'),
                  pattern: i18n.get('errors.hasToMatchPattern'),
                  url: i18n.get('errors.validUrl'),
                  min: i18n.get('errors.minValue', {count: element.attr('min')}),
                  minlength: i18n.get('errors.minLength', {count: element.attr('ng-minlength')}),
                  max: i18n.get('errors.maxValue', {count: element.attr('max')}),
                  maxlength: i18n.get('errors.maxLength', {count: element.attr('ng-maxlength')}),
                  phone: i18n.get('errors.phoneNumber'),
                  hex: i18n.get('errors.hex'),
                  unique: i18n.get('errors.notUnique'),
                  match: i18n.get('errors.doesNotMatch'),
                  emailOrPlaceholder: i18n.get('errors.emailOrPlaceholder'),
                  withoutChar: i18n.get('errors.withoutChar', {char: element.attr('mw-validate-without-char')})
                };
              };
              buildValidationValues();
              $scope.$on('i18n:localeChanged', buildValidationValues);
            }
          };
        }
      };
    })

  /**
   * @ngdoc directive
   * @name mwForm.directive:mwMultiSelect
   * @element div
   * @description
   *
   * Can be used for a selectbox where multiple values can be selected
   * Generates checkboxes and pushes or removes values into an array
   *
   * @scope
   *
   * @param {expression} model Model where the selected values should be saved in
   * @param {expression} options Options which can be selected
   *
   */
    .directive('mwFormMultiSelect', function () {
      return {
        restrict: 'A',
        transclude: true,
        require: '^?form',
        scope: {
          model: '=',
          options: '=',
          query: '=filter',
          mwRequired: '='
        },
        templateUrl: 'modules/ui/templates/mwForm/mwFormMultiSelect.html',
        controller: function ($scope) {

          if (!angular.isArray($scope.model)) {
            $scope.model = [];
          }

          if (angular.isArray($scope.options)) {
            var objOptions = {};
            $scope.options.forEach(function (option) {
              objOptions[option] = option;
            });

            $scope.options = objOptions;
          }

          $scope.getObjectSize = function (obj) {
            return _.size(obj);
          };

          $scope.filter = function (items) {
            var result = {};

            angular.forEach(items, function (value, key) {

              if (!$scope.query || !value || value.match($scope.query.toLowerCase()) || value.match($scope.query.toUpperCase())) {
                result[key] = value;
              }
            });
            return result;
          };

          $scope.toggleKeyIntoModelArray = function (key) {

            $scope.model = $scope.model || [];
            //Check if key is already in the model array
            //When user unselects a checkbox it will be deleted from the model array
            if ($scope.model.indexOf(key) >= 0) {
              // Delete key from model array
              $scope.model.splice($scope.model.indexOf(key), 1);
              // Delete model if no attribute is in there (for validation purposes)
              if ($scope.model.length === 0) {
                delete $scope.model;
              }
            } else {
              $scope.model.push(key);
            }
          };

        },
        link: function (scope, el, attr, form) {

          scope.showRequiredMessage = function () {
            return ( (!scope.model || scope.model.length < 1) && scope.required);
          };

          scope.setDirty = function () {
            if (form) {
              form.$setDirty();
            }
          };
        }
      };
    })

    .directive('mwFormMultiSelect2', function () {
      return {
        restrict: 'A',
        transclude: true,
        require: '^?form',
        scope: {
          mwCollection: '=',
          mwOptionsCollection: '=',
          mwOptionsLabelKey: '@',
          mwOptionsLabelI18nPrefix: '@',
          mwRequired: '=',
          mwDisabled: '='
        },
        templateUrl: 'modules/ui/templates/mwForm/mwFormMultiSelect2.html',
        link: function (scope, elm, attr, formCtrl) {
          if (scope.mwOptionsCollection.length === 0) {
            scope.mwOptionsCollection.fetch();
          }

          scope.toggleModel = function (model) {
            var existingModel = scope.mwCollection.findWhere(model.toJSON());
            if (existingModel) {
              scope.mwCollection.remove(existingModel);
            } else {
              scope.mwCollection.add(model.toJSON());
            }
            if (formCtrl) {
              formCtrl.$setDirty();
            }
          };
        }
      };
    })

  /**
   * @ngdoc directive
   * @name mwForm.directive:mwFormCheckbox
   * @element div
   * @description
   *
   * Wrapper for checkbox elements. Adds form HTML and corresponding CSS.
   *
   * @scope
   *
   * @param {string} label Label to show
   *
   */
    .directive('mwFormCheckbox', function () {
      return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
          mwClass: '@class',
          label: '@',
          tooltip: '@',
          badges: '@'
        },
        templateUrl: 'modules/ui/templates/mwForm/mwFormCheckbox.html',
        link: function (scope) {
          if (scope.badges) {
            var formatBadges = function () {
              scope.typedBadges = [];
              var splittedBadges = scope.badges.split(',');
              angular.forEach(splittedBadges, function (badge) {
                var type = 'info';
                if (badge.toLowerCase().indexOf('android') > -1) {
                  type = 'android';
                }
                if (badge.toLowerCase().indexOf('ios') > -1) {
                  type = 'ios';
                }
                if (badge.toLowerCase().indexOf('safe') > -1) {
                  type = 'safe';
                }
                if (badge.toLowerCase().indexOf('-safe-') > -1) {
                  badge = 'SAFE';
                  type = 'notsafe';
                }
                if (badge.toLowerCase().indexOf('safe') > -1 &&
                  badge.toLowerCase().indexOf('android') > -1) {
                  type = 'multi';
                }
                scope.typedBadges.push({
                  text: badge,
                  type: type
                });
              });
            };
            scope.$watch('badges', formatBadges);
          }
        }
      };
    })

    .directive('mwCustomSelect', function () {
      return {
        require: '^?ngModel',
        link: function (scope, el, attrs, ngModel) {
          var customSelectWrapper = angular.element('<span class="custom-select mw-select"></span>');

          var render = function () {
            el.wrap(customSelectWrapper);
            el.addClass('custom');
          };

          scope.$watch(
            function () {
              return ngModel.$modelValue;
            },
            function(val){
              if (angular.isUndefined(val)) {
                el.addClass('default-selected');
              } else {
                el.removeClass('default-selected');
              }
            }
          );

          render();
        }
      };
    })


  /**
   * @ngdoc directive
   * @name mwForm.directive:mwCustomCheckbox
   * @element input
   * @scope
   *
   * @param {boolean} radio If true, adds class 'round' to wrapping span element
   * @description
   *
   * Replaces native checkbox with custom checkbox
   *
   */
    .directive('mwCustomCheckbox', function ($window) {
      return {
        restrict: 'A',
        replace: true,
        require: '?ngModel',
        transclude: true,
        scope: {
          radio: '='
        },
        link: function (scope, el, attr, ngModel) {



          // set the active class on the checkbox wrapper
          var setActiveClass = function (checked) {
            if (checked) {
              el.parent().addClass('active');
            } else {
              el.parent().removeClass('active');
            }
          };

          scope.$watch('radio', function (newVal) {
            if (newVal === true) {
              el.parent().addClass('round');
            }
          });

          // render custom checkbox
          // to preserve the functionality of the original checkbox we just wrap it with a custom element
          // checkbox is set to opacity 0 and has to be positioned absolute inside the custom checkbox element which has to be positioned relative
          // additionally a custom status indicator is appended as a sibling of the original checkbox inside the custom checkbox wrapper
          var render = function () {
            var customCheckbox = angular.element('<span class="custom-checkbox mw-checkbox"></span>'),
              customCheckboxStateIndicator = angular.element('<span class="state-indicator"></span>'),
              customCheckboxStateFocusIndicator = angular.element('<span class="state-focus-indicator"></span>');

            el.wrap(customCheckbox);
            customCheckboxStateIndicator.insertAfter(el);
            customCheckboxStateFocusIndicator.insertAfter(customCheckboxStateIndicator);
          };

          (function init() {

            //check the value every time the checkbox is clicked
            el.on('change', function () {
              setActiveClass(el.is(':checked'));
            });

            //unbind eventlistener to prevent infinite loops!
            //after this the remaining element is removed
            el.on('$destroy', function () {
              el.off('$destroy');
              el.parent('.mw-checkbox').remove();
            });

            if (ngModel) {
              //when a model is defined use the value which is passed into the formatters function during initialization
              ngModel.$formatters.unshift(function (checked) {
                setActiveClass(checked);
                return checked;
              });
            }

            //jQuery does not trigger a change event when checkbox is checked programmatically e.g. by ng-checked
            //property hooks triggers a change event everytime the setter is called
            //TODO find a angularjs solution for this
            $window.$.propHooks.checked = {
              set: function (el, value) {

                var trigger;
                if (el.checked !== value) {
                  trigger = true;
                } else {
                  trigger = false;
                }
                el.checked = value;
                if (trigger) {
                  $window.$(el).trigger('change');
                }
              }
            };

            render();
          }());
        }
      };
    })

    .directive('mwCustomRadio', function ($window) {
      return {
        restrict: 'A',
        replace: true,
        require: '?ngModel',
        transclude: true,
        link: function (scope, el, attr, ngModel) {

          // set the active class on the checkbox wrapper
          var setActiveClass = function (checked) {
            if (checked) {
              el.parent().addClass('active');
            } else {
              el.parent().removeClass('active');
            }
          };

          // render custom checkbox
          // to preserve the functionality of the original checkbox we just wrap it with a custom element
          // checkbox is set to opacity 0 and has to be positioned absolute inside the custom checkbox element which has to be positioned relative
          // additionally a custom status indicator is appended as a sibling of the original checkbox inside the custom checkbox wrapper
          var render = function () {
            var customRadio = angular.element('<span class="custom-radio mw-radio"></span>'),
              customRadioStateIndicator = angular.element('<span class="state-indicator"></span>'),
              customRadioStateFocusIndicator = angular.element('<span class="state-focus-indicator"></span>');

            el.wrap(customRadio);
            customRadioStateIndicator.insertAfter(el);
            customRadioStateFocusIndicator.insertAfter(customRadioStateIndicator);
          };

          (function init() {
            //check the value every time the checkbox is clicked
            el.on('change', function () {
              var previousSelescted = angular.element('.mw-radio.active');
              //check if the previous selected is an item of the current selected for the case that multiple radio groups are on one page
              //unselect all elements which are currently active from this name group

              previousSelescted.each(function () {
                var $el = angular.element(this);
                if ($el.find('input[name=' + el.attr('name') + ']').length > 0) {
                  if (!$el.find('input[type=radio]').is(':checked')) {
                    $el.removeClass('active');
                  }
                }
              });
              if (el.is(':checked')) {
                setActiveClass(el.is(':checked'));
              }
            });

            //unbind eventlistener to prevent infinite loops!
            //after this the remaining element is removed
            el.on('$destroy', function () {
              el.off('$destroy');
              el.parent('.mw-radio').remove();
            });

            if (ngModel) {
              //when a model is defined use the value which is passed into the formatters function during initialization
              ngModel.$formatters.unshift(function (value) {
                if (value && value === el.attr('value')) {
                  setActiveClass(true);
                }
                return value;
              });
            }

            //jQuery does not trigger a change event when checkbox is checked programmatically e.g. by ng-checked
            //property hooks triggers a change event everytime the setter is called
            //TODO find a angularjs solution for this
            $window.$.propHooks.checked = {
              set: function (el, value) {

                var trigger;
                if (el.checked !== value) {
                  trigger = true;
                } else {
                  trigger = false;
                }
                el.checked = value;
                if (trigger) {
                  $window.$(el).trigger('change');
                }
              }
            };

            render();

            window.setTimeout(function () {
              $window.$(el).trigger('change');
            }, 0);

          }());
        }
      };
    })

  /**
   * @ngdoc directive
   * @name mwForm.directive:mwFormWrapper
   * @element div
   * @description
   *
   * Wrapper for custom elements. Adds form HTML and corresponding CSS.
   * Does not include validation or any other functional components.
   *
   * @scope
   *
   * @param {string} label Label to show
   * @param {string} tooltip Tooltip to display
   *
   */
    .directive('mwFormWrapper', function () {
      return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
          label: '@',
          tooltip: '@'
        },
        templateUrl: 'modules/ui/templates/mwForm/mwFormWrapper.html'
      };
    })


  /**
   * @ngdoc directive
   * @name mwForm.directive:mwFormValidation
   * @element span
   * @description
   * **Important!:** Can only be placed inside of {@link mwForm.directive:mwFormInput mwFormInput}.
   *
   * Adds validation messages if validation for given key fails.
   *
   * @scope
   *
   * @param {string} mwFormsValidation The key to validate a model
   */
    .directive('mwFormValidation', function () {
      return {
        restrict: 'A',
        replace: true,
        transclude: true,
        require: ['^mwFormInput', '^form'],
        scope: {
          validation: '@mwFormValidation'
        },
        template: '<span class="help-block" ng-show="isValid()" ng-transclude></span>',
        link: function (scope, elm, attr, controllers) {
          var mwFormInputCtrl = controllers[0],
            inputName = mwFormInputCtrl.element.attr('name'),
            form = controllers[1],
            invalid = false;

          if (!inputName) {
            invalid = true;
            throw new Error('element doesn\'t have name attribute');
          }

          if (form && !form[inputName]) {
            invalid = true;
            throw new Error('element ' + inputName + ' not found');
          }

          scope.isValid = function () {
            if (invalid || !form) {
              return false;
            } else {
              if (form[inputName]) {
                return form[inputName].$error[scope.validation];
              }
            }
          };
        }
      };
    })

  /**
   * @ngdoc directive
   * @name mwForm.directive:mwForm
   * @element form
   * @description
   *
   * Adds form specific behaviour
   *
   */
    .directive('form', function () {
      return {
        restrict: 'E',
        link: function (scope, elm) {
          elm.addClass('form-horizontal');
          elm.attr('novalidate', 'true');
        }
      };
    })

  /**
   * @ngdoc directive
   * @name mwForm.directive:mwLeaveConfirmation
   * @element form
   * @description
   *
   * Opens a confirmation modal when the form has been edited and a the user wants to navigate to a new page
   *
   */

    .directive('mwFormLeaveConfirmation', function ($window, $document, $location, i18n, Modal, $compile) {
      return {
        require: '^form',
        link: function (scope, elm, attr, form) {
          scope.form = form;
          scope.text = i18n.get('common.confirmModal.description');
          var confirmation = $compile('<div mw-leave-confirmation="form.$dirty" text="{{text}}"></div>')(scope);
          elm.append(confirmation);

          scope.$on('$destroy', function () {
            scope.form.$dirty = false;
          });
        }
      };
    })

  /**
   * @ngdoc directive
   * @name mwForm.directive:mwFormActions
   * @element form
   * @description
   *
   * Adds buttons for save and cancel. Must be placed inside a form tag.
   * (Form controller has to be available on the parent scope!)
   *
   * @scope
   *
   * @param {expression} save Expression to evaluate on click on 'Save' button
   * @param {expression} cancel Expression to evaluate on click on 'cancel' button
   *
   */
    .directive('mwFormActions', function (Loading, $route) {
      return {
        replace: true,
        scope: {
          save: '&',
          cancel: '&',
          showSave: '=',
          showCancel: '='
        },
        templateUrl: 'modules/ui/templates/mwForm/mwFormActions.html',
        link: function (scope, elm, attr) {

          scope.isLoading = Loading.isLoading;

          scope.form = elm.inheritedData('$formController');
          scope.hasCancel = angular.isDefined(attr.cancel);
          scope.hasSave = angular.isDefined(attr.save);
          scope._showSave = true;
          scope._showCancel = true;
          scope.executeDefaultCancel = (attr.cancel === 'true');

          scope.$watch('showSave', function(val){
            if(angular.isDefined(val)){
              scope._showSave = val;
            }
          });

          scope.$watch('showCancel', function(val){
            if(angular.isDefined(val)){
              scope._showCancel = val;
            }
          });

          var setFormPristineAndEvaluate = function (exec) {
            if (scope.form) {
              scope.form.$setPristine();
            }
            scope.$eval(exec);
          };

          scope.saveFacade = function () {
            setFormPristineAndEvaluate(scope.save);
          };

          scope.cancelFacade = function () {
            if (scope.cancel && scope.executeDefaultCancel) {
              setFormPristineAndEvaluate(function () {
                $route.reload();
              });
            } else {
              setFormPristineAndEvaluate(scope.cancel);
            }
          };
        }
      };
    })


  /**
   * @ngdoc directive
   * @name mwForm.directive:select
   * @restrict E
   * @description
   *
   * Extends the select element, by adding class 'form-control' and registers
   * it on {@link mwForm.directive:mwFormInput mwFormInput}.
   *
   */
    .directive('select', extendHTMLElement)


  /**
   * @ngdoc directive
   * @name mwForm.directive:input
   * @restrict E
   * @description
   *
   * Extends the input[text] element, by adding class 'form-control' and
   * registers it on {@link mwForm.directive:mwFormInput mwFormInput}.
   *
   */
    .directive('input', extendHTMLElement)
    .directive('input', addDefaultValidations)

  /**
   * @ngdoc directive
   * @name mwForm.directive:textarea
   * @restrict E
   * @description
   *
   * Extends the textarea element, by adding class 'form-control' and
   * registers it on {@link mwForm.directive:mwFormInput mwFormInput}.
   *
   */
    .directive('textarea', extendHTMLElement)
    .directive('textarea', addDefaultValidations);


})();


