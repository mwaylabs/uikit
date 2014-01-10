'use strict';

(function () {

  angular.module('mwFormValidators', [])

  /**
   * @ngdoc directive
   * @name mwFormValidators.directive:mwValidatePhone
   * @element input
   * @description
   *
   * Adds validation for phone numbers.
   * Valid Examples are: +491234567 or 00491234567
   *
   * Note: this directive requires `ngModel` to be present.
   *
   */
      .directive('mwValidatePhone', function () {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, elm, attr, ngModel) {
            var telExpression = /^(00[1-9]\d{8,}|^\+[1-9]\d{8,})$/;

            var removeNonDigitValues = function (value) {
              if (value) {
                value = value.replace(/[^0-9+]/g, '');
              }
              return value;
            };

            var validateNumber = function (value) {
              var isValid = true;
              if (value) {
                isValid = value.match(telExpression);
              }
              ngModel.$setValidity('phone', isValid);
              return value;
            };

            ngModel.$formatters.push(validateNumber, removeNonDigitValues);
            ngModel.$parsers.push(validateNumber);
          }
        };
      });


})();