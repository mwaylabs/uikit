'use strict';

angular.module('mwForm', [])

/**
 * @ngdoc directive
 * @name mwForm.directive:mwFormInput
 * @element div
 * @description
 *
 * Wrapper for input elements. Adds validation messages, form HTML and corresponding CSS.
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
        link: function (scope, elm) {
          var input = elm.find('input');
          input.addClass('form-control');
          scope.inputName = input.attr('name');
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
        scope: {
          validation: '@mwFormValidation'
        },
        template: '<span class="help-block" ng-show="isValid()" ng-transclude></span>',
        link: function (scope) {
          var parent = scope.$parent;
          scope.isValid = function () {
            if(!parent.form) {
              throw new Error('missing form on parent scope!');
            }
            return parent.form[parent.inputName].$error[scope.validation];
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
          back: '&'
        },
        templateUrl: 'modules/ui/templates/mwForm/mwFormActions.html',
        link: function(scope, elm, attr, formCtrl) {
          scope.form = formCtrl;
        }
      };
    });