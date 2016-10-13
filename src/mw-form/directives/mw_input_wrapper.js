angular.module('mwUI.Form')

  .directive('mwInputWrapper', function () {
    return {
      transclude: true,
      scope: {
        label: '@',
        tooltip: '@',
        hideErrors: '='
      },
      templateUrl: 'uikit/mw-form/directives/templates/mw_input_wrapper.html',
      controller: function () {
        var modelState = {
            dirty: true,
            valid: true,
            touched: false
          },
          inputState = {
            required: false,
            focused: false
          },
          inputType = 'text';

        var setObj = function (obj, val) {
          if (angular.isObject(val)) {
            _.extend(obj, val);
          } else {
            throw new Error('State has to be an object');
          }
        };

        // Will be called by ngModel modification in mw-form/directives/ng-model
        this.setModelState = function (newState) {
          setObj(modelState, newState);
        };

        this.getModelState = function () {
          return modelState;
        };

        // Will be called by ngModel modification in mw-form/directives/ng-model
        this.setInputState = function (newState) {
          setObj(inputState, newState);
        };

        this.getInputState = function () {
          return inputState;
        };

        // Will be called by mwInputDefaults in mw-inputs/directives
        this.setType = function(type){
          inputType = type;
        };

        this.getType = function(){
          return inputType;
        };
      },
      link: function (scope, el, attrs, ctrl) {

        scope.isValid = function () {
          return ctrl.getModelState().valid;
        };

        scope.isDirty = function () {
          return ctrl.getModelState().dirty;
        };

        scope.isTouched = function () {
          return ctrl.getModelState().touched;
        };

        scope.isRequired = function () {
          return ctrl.getInputState().required;
        };

        scope.isFocused = function () {
          return ctrl.getInputState().focused;
        };

        scope.hasError = function () {
          return !scope.hideErrors && !scope.isValid() && scope.isDirty();
        };

        scope.hasRequiredError = function () {
          return scope.isRequired() && !scope.isValid();
        };

        scope.getType = ctrl.getType;
      }
    };
  });