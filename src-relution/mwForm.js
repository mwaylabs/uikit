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
        if (attr.type !== 'number' && ngModelController && dontSkipIt && !ngModelController.$validators.maxlength && !attr.ngMaxlength) {
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

    .provider('mwValidationMessages', function () {
      var _registeredValidators = {},
        _translatedValidators = {},
        _functionValidators = {},
        _executedValidators = {};

      var _setValidationMessage = function (key, validationMessage) {
        if (typeof validationMessage === 'function') {
          _functionValidators[key] = validationMessage;
        } else {
          _registeredValidators[key] = validationMessage;
        }
      };

      this.registerValidator = function (key, validationMessage) {
        if (!_registeredValidators[key] && !_functionValidators[key]) {
          _setValidationMessage(key, validationMessage);
        } else {
          throw new Error('The key ' + key + ' has already been registered');
        }
      };

      this.$get = function ($rootScope, i18n) {
        var _translateRegisteredValidators = function () {
          _.pairs(_registeredValidators).forEach(function (pair) {
            var key = pair[0],
              value = pair[1];
            if (i18n.translationIsAvailable(value)) {
              _translatedValidators[key] = i18n.get(value);
            } else {
              _translatedValidators[key] = value;
            }
          });
        };

        var _executeFunctionValidators = function () {
          _.pairs(_functionValidators).forEach(function (pair) {
            var key = pair[0],
              fn = pair[1];
            _executedValidators[key] = fn();
          });
        };

        var _setValidationMessages = function () {
          _translateRegisteredValidators();
          _executeFunctionValidators();
          $rootScope.$broadcast('mwValidationMessages:change');
        };

        _setValidationMessages();
        $rootScope.$on('i18n:localeChanged', function () {
          _setValidationMessages();
        });

        return {
          getRegisteredValidators: function () {
            return _.extend(_translatedValidators, _executedValidators);
          },
          updateMessage: function (key, message) {
            if (_registeredValidators[key] || _functionValidators[key]) {
              _setValidationMessage(key, message);
              _setValidationMessages();
            } else {
              throw new Error('The key ' + key + ' is not available. You have to register it first via the provider');
            }
          }
        };
      };
    })

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
        require: '^form',
        scope: {
          label: '@',
          tooltip: '@',
          hideErrors: '='
        },
        templateUrl: 'uikit/templates/mwForm/mwFormInput.html',
        link: function (scope, elm, attr, ctrl) {

          var getElementCtrl = function () {
            if (ctrl && scope.elementName && ctrl[scope.elementName]) {
              return ctrl[scope.elementName];
            }
          };


          scope.isInvalid = function () {
            var elCtrl = getElementCtrl();
            return (elCtrl) ? elCtrl.$invalid : false;
          };

          scope.isDirty = function () {
            var elCtrl = getElementCtrl();
            return (elCtrl) ? elCtrl.$dirty : false;
          };

          scope.getCurrentErrors = function () {
            var elCtrl = getElementCtrl();
            return (elCtrl) ? elCtrl.$error : undefined;
          };

          scope.isRequiredError = function () {
            var elCtrl = getElementCtrl();
            return (elCtrl && elCtrl.$error) ? elCtrl.$error.required : false;
          };

          scope.isRequired = function () {
            var requiredInputs = elm.find('input[required],select[required],textarea[required]');
            return requiredInputs.length > 0;
          };


        },
        controller: function ($scope, mwValidationMessages) {
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

              $scope.$watch(function () {
                return element.attr('mw-validation-message');
              }, function (val) {
                if (val) {
                  buildValidationValues();
                }
              });

              var buildValidationValues = function () {
                var registeredValidators = mwValidationMessages.getRegisteredValidators(),
                  defaultValidators = {
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
                    itunesOrHttpLink: i18n.get('errors.itunesOrHttpLink')
                  };

                $scope.validationValues = _.extend(defaultValidators, registeredValidators);

              };
              buildValidationValues();
              $scope.$on('mwValidationMessages:change', buildValidationValues);
            }
          };
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
        templateUrl: 'uikit/templates/mwForm/mwFormWrapper.html',
        link: function (scope, el) {
          scope.isRequired = function () {
            var requiredInputs = el.find('input[required],select[required],textarea[required]');
            return requiredInputs.length > 0;
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
        templateUrl: 'uikit/templates/mwForm/mwFormMultiSelect.html',
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
        templateUrl: 'uikit/templates/mwForm/mwFormMultiSelect2.html',
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
        templateUrl: 'uikit/templates/mwForm/mwFormCheckbox.html',
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
                if (badge.toLowerCase().indexOf('knox') > -1) {
                  type = 'knox';
                }
                if (badge.toLowerCase().indexOf('-knox-') > -1) {
                  badge = 'KNOX';
                  type = 'notsafe';
                }
                if (badge.toLowerCase().indexOf('knox') > -1 &&
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
        link: function (scope, el) {
          el.addClass('form-horizontal');
          el.attr('novalidate', 'true');

          var noPasswordAutocomplete = angular.element(
            '<!-- fake fields are a workaround for chrome autofill getting the wrong fields -->' +
            '<input style="display:none" type="text" name="fakeusernameremembered"/>' +
            '<input style="display:none" type="password" name="fakepasswordremembered"/>'
          );

          el.prepend(noPasswordAutocomplete);
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
        templateUrl: 'uikit/templates/mwForm/mwFormActions.html',
        link: function (scope, elm, attr) {

          scope.isLoading = Loading.isLoading;

          scope.form = elm.inheritedData('$formController');
          scope.hasCancel = angular.isDefined(attr.cancel);
          scope.hasSave = angular.isDefined(attr.save);
          scope._showSave = true;
          scope._showCancel = true;
          scope.executeDefaultCancel = (attr.cancel === 'true');

          scope.$watch('showSave', function (val) {
            if (angular.isDefined(val)) {
              scope._showSave = val;
            }
          });

          scope.$watch('showCancel', function (val) {
            if (angular.isDefined(val)) {
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
    .directive('textarea', addDefaultValidations)

    /**
     * @ngdoc directive
     * @name mwForm.directive:mwPasswordToggler
     * @element input
     * @description
     *
     * Adds an eye button for password fields to show the password in clear text
     *
     */
    .directive('mwPasswordToggler', function ($compile) {
      return {
        restrict: 'A',
        link: function (scope, el) {

          var render = function () {
            var passwordWrapper = angular.element('<div class="mw-password-toggler input-group"></div>'),
              passwordToggleBtn = $compile(
                '<span class="input-group-addon toggler-btn clickable" ng-click="togglePassword()" ng-if="showToggler()">' +
                '<span ng-if="isPassword()" mw-icon="fa-eye"></span>' +
                '<span ng-if="!isPassword()" mw-icon="fa-eye-slash"></span>' +
                '</span>')(scope);

            el.wrap(passwordWrapper);
            passwordToggleBtn.insertAfter(el);
          };

          scope.isPassword = function () {
            return el.attr('type') === 'password';
          };

          scope.togglePassword = function () {
            if (scope.isPassword()) {
              el.attr('type', 'text');
            } else {
              el.attr('type', 'password');
            }
          };


          scope.showToggler = function () {
            return !el.is(':disabled');
          };

          // remove input group class when input is disabled so it is displaaed like a normal input element
          scope.$watch(scope.showToggler, function (showToggler) {
            var passwordWrapper = el.parent('.mw-password-toggler');
            if (showToggler) {
              passwordWrapper.addClass('input-group');
            } else {
              passwordWrapper.removeClass('input-group');
            }
          });

          render();
        }
      };
    });

})();


