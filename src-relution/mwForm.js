'use strict';

(function () {

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
     * @name mwForm.directive:input
     * @restrict E
     * @description
     *
     * Extends the input[text] element, by adding class 'form-control' and
     * registers it on {@link mwForm.directive:mwFormInput mwFormInput}.
     *
     */
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


