'use strict';

(function () {

  // Common used function to put defaults onto some HTML elements
  var extendHTMLElement = function () {
    return {
      restrict: 'E',
      link: function (scope, elm) {
        var skipTheFollowing = ['checkbox', 'radio'];

        if (skipTheFollowing.indexOf(elm.attr('type')) === -1 && scope.$$prevSibling) {
          // Add default class coming from bootstrap
          elm.addClass('form-control');
          if (scope.$$prevSibling) {
            // Register on mwFormInput if element is surrounded by mwFormInput
            if (angular.isFunction(scope.$$prevSibling.mwFormInputRegister)) {
              scope.$$prevSibling.mwFormInputRegister(elm);
            }
          }
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
   *
   * @scope
   *
   * @param {string} label Label to show
   * @param {expression} hideErrors If true, doesn't show validation messages. Default is false
   *
   */
      .directive('mwFormInput', function () {
        return {
          restrict: 'A',
          transclude: true,
          scope: {
            label: '@',
            tooltip: '@',
            hideErrors: '='
          },
          templateUrl: 'modules/ui/templates/mwForm/mwFormInput.html',
          controller: function ($scope) {
            var that = this;
            that.element = null;
            $scope.mwFormInputRegister = function (element) {
              if (!that.element) {
                that.element = element;
                $scope.minValue = element.attr('min');
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
            label: '@',
            tooltip: '@'
          },
          templateUrl: 'modules/ui/templates/mwForm/mwFormCheckbox.html'
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
          require: '^mwFormInput',
          scope: {
            validation: '@mwFormValidation'
          },
          template: '<span class="help-block" ng-show="isValid()" ng-transclude></span>',
          link: function (scope, elm, attr, mwFormInputCtrl) {

            var inputName = mwFormInputCtrl.element.attr('name'),
                parent = scope.$parent,
                invalid = false;

            if (!inputName) {
              invalid = true;
              throw new Error('element doesn\'t have name attribute');
            }

            if (!parent.form) {
              invalid = true;
              throw new Error('missing form on parent scope!');
            }
            if (!parent.form[inputName]) {
              invalid = true;
              throw new Error('element ' + inputName + ' not found');
            }

            scope.isValid = function () {
              if (invalid) {
                return false;
              } else {
                return parent.form[inputName].$error[scope.validation];
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
      .directive('mwForm', function () {
        return {
          link: function (scope, elm) {
            elm.addClass('form-horizontal');
            elm.attr('novalidate', 'true');
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
      .directive('mwFormActions', function () {
        return {
          replace: true,
          require: '^form',
          scope: {
            save: '&',
            cancel: '&'
          },
          templateUrl: 'modules/ui/templates/mwForm/mwFormActions.html',
          link: function (scope, elm, attr, formCtrl) {
            scope.form = formCtrl;
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
      .directive('textarea', extendHTMLElement);


})();


