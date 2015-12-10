'use strict';

(function () {

  var validateRegex = function (value, regex) {
    if (value) {
      return !!value.match(regex);
    } else {
      return true;
    }
  };

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
          var regex = /^\+(?:[0-9]){6,14}[0-9]$/;

          var removeNonDigitValues = function (value) {
            if (value) {
              value = value.replace(/[^ 0-9+]/g, '');
            }
            return value;
          };

          var validateNumber = function (value) {
            return validateRegex(value, regex);
          };

          ngModel.$validators.phone = validateNumber;
          ngModel.$formatters.push(removeNonDigitValues);
        }
      };
    })

    .directive('mwValidateHex', function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {
          var regex = /^(0x)?([0-9A-Fa-f])+$/;

          var validateHex = function (value) {
            ngModel.$setValidity('hex', validateRegex(value, regex));
            return value;
          };

          ngModel.$formatters.push(validateHex);
          ngModel.$parsers.push(validateHex);
        }
      };
    })

    .directive('mwValidateCollectionOrModel', function () {
      return {
        restrict: 'A',
        scope: {
          mwModel: '=mwValidateCollectionOrModel',
          mwRequired: '=',
          mwKey: '@'
        },
        require: '^?form',
        template: '<input type="text" ng-required="mwRequired" ng-model="model.tmp" name="{{uId}}" style="display: none">',
        link: function (scope, el, attr, formController) {

          var key = scope.mwKey || 'uuid';

          scope.model = {};
          scope.uId = _.uniqueId('validator_');

          var setDirty = function(){
            if(formController){
              formController.$setDirty();
            }
          };

          var unwatch = scope.$watch('mwModel', function () {
            var val = scope.mwModel;
            if (val) {
              if (val instanceof window.Backbone.Collection) {
                val.on('add remove reset', function () {
                  if(val.length > 0){
                    scope.model.tmp = val.first().get(key);
                  } else {
                    scope.model.tmp = undefined;
                  }
                  setDirty();
                });
                if(val.length > 0){
                  scope.model.tmp = val.first().get(key);
                } else {
                  scope.model.tmp = undefined;
                }
              } else if (val instanceof window.Backbone.Model) {
                key = scope.mwKey || val.idAttribute;
                val.on('change:'+key, function () {
                  scope.model.tmp = val.get(key);
                  setDirty();
                });
                scope.model.tmp = val.get(key);
              } else {
                throw new Error('Value is neither a model nor a collection! Make its one of them', val);
              }
              unwatch();
            }
          });
        }
      };
    })

    .directive('mwValidatePlaceholder', function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {
          var regex = /\$\{.*\}/;


          var validatePlaceholder = function (value) {
            ngModel.$setValidity('placeholder', validateRegex(value, regex));
            return value;
          };

          ngModel.$formatters.push(validatePlaceholder);
          ngModel.$parsers.push(validatePlaceholder);
        }
      };
    })

    .directive('mwValidatePlaceholderOrMail', function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {
          var mailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+([.][a-zA-Z0-9_-]+)*[.][a-zA-Z0-9._-]+$/,
            placeholderRegex = /\$\{.+\}/;

          ngModel.$validators.emailOrPlaceholder = function(value){
            return !!(validateRegex(value, mailRegex) || validateRegex(value, placeholderRegex));
          };
        }
      };
    })

    .directive('mwValidateMatch', function () {
      return {
        require: 'ngModel',
        link: function (scope, elm, attr, ctrl) {
          var pwdWidget = elm.inheritedData('$formController')[attr.mwValidateMatch];

          ctrl.$parsers.push(function (value) {
            var isValid = false;
            if (value === pwdWidget.$viewValue) {
              isValid = true;
            }
            ctrl.$setValidity('match', isValid);
            return value;
          });

          pwdWidget.$parsers.push(function (value) {
            var isValid = false;
            if (value === ctrl.$viewValue) {
              isValid = true;
            }
            ctrl.$setValidity('match', isValid);
            return value;
          });
        }
      };
    })

  /**
   * @ngdoc directive
   * @name mwFormValidators.directive:mwValidateUniqueness
   * @element input
   * @description
   *
   * Adds validation of uniqueness for a given array of strings.
   *
   * @param {Array.<String>} mwValidateUniqueness Array of existing items to validate against
   *
   * Note: this directive requires `ngModel` to be present.
   *
   */
    .directive('mwValidateUniqueness', function () {
      return {
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {
          var existingValues;

          scope.$watch(attr.mwValidateUniqueness, function (value) {
            existingValues = value;
          });

          /**
           * Add parser/formatter to model which checks if the model value is
           * a value that already exists and set validation state accordingly
           */
          var validateUniqueness = function (value) {
            var isValid = true;
            if (angular.isArray(existingValues) && existingValues.length > 0 && value && ngModel.$dirty) {
              isValid = (existingValues.indexOf(value) === -1);
            }
            ngModel.$setValidity('unique', isValid);
            return value;
          };
          ngModel.$parsers.unshift(validateUniqueness);
          ngModel.$formatters.unshift(validateUniqueness);
        }
      };
    })

    .directive('mwValidateWithoutChar', function(){
      return {
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {
          ngModel.$validators.withoutChar = function(value){
            if(_.isString(value)){
              return value.indexOf(attr.mwValidateWithoutChar) < 0;
            } else {
              return true;
            }
          };
        }
      };
    })

    .directive('mwValidateItunesOrHttpLink', function(){
      return {
        require: 'ngModel',
        link: function (scope, elm, attr, ngModel) {
          var itunesOrHttpLinkRegex = /^(https?|itms|itms-apps):\/\/.+$/;
          ngModel.$validators.itunesOrHttpLink = function(value){
            return validateRegex(value, itunesOrHttpLinkRegex);
          };
        }
      };
    })

    .config(function(mwValidationMessagesProvider){
      mwValidationMessagesProvider.registerValidator('minValidDate','errors.minDate');
      mwValidationMessagesProvider.registerValidator('maxValidDate','errors.maxDate');
    })

    .directive('mwValidateDate', function(mwValidationMessages, i18n){
      return {
        require: 'ngModel',
        link: function(scope, el, attrs, ngModel){

          ngModel.$validators.minValidDate = function(value){
            var minDate = scope.$eval(attrs.minDate),
              currentDateTs = +new Date(value),
              minDateTs = +new Date(minDate);

            return !minDate || !value || currentDateTs > minDateTs;
          };

          ngModel.$validators.maxValidDate = function(value){
            var maxDate = scope.$eval(attrs.maxDate),
              currentDateTs = +new Date(value),
              maxDateTs = +new Date(maxDate);

            return !maxDate || !value || currentDateTs < maxDateTs;
          };

          attrs.$observe('minDate', function(val){
            if(val){
              mwValidationMessages.updateMessage('minValidDate', function(){
                return i18n.get('errors.minValidDate',{ minDate: new Date( scope.$eval(val) ).toLocaleString() });
              });
            }
          });
          attrs.$observe('maxDate', function(val){
            if(val){
              mwValidationMessages.updateMessage('maxValidDate', function(){
                return i18n.get('errors.maxValidDate',{ maxDate: new Date( scope.$eval(val) ).toLocaleString() });
              });
            }
          })
        }
      }
    });

})();