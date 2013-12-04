'use strict';

angular.module('mwForms', [])

    .directive('mwFormsInput', function () {
      return {
        restriction: 'A',
        transclude: true,
        scope: {
          label: '@',
          hideErrors: '='
        },
        templateUrl: 'modules/ui/templates/mwFormsInput.html',
        link: function (scope, elm) {
          var input = elm.find('input');
          input.addClass('form-control');
          scope.inputName = input.attr('name');
        }
      };
    })

    .directive('mwFormsValidation', function () {
      return {
        restriction: 'A',
        replace: true,
        transclude: true,
        scope: {
          validation: '@mwFormsValidation'
        },
        template: '<span class="help-block" ng-show="isValid()" ng-transclude></span>',
        link: function (scope) {
          var parent = scope.$parent;
          scope.isValid = function() {
            return parent.form[parent.inputName].$error[scope.validation];
          };
        }
      };
    });