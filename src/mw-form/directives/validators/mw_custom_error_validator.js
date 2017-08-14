angular.module('mwUI.Form')
  .config(function(mwValidationMessagesProvider){
    mwValidationMessagesProvider.registerValidator(
      'customValidation',
      'mwErrorMessages.invalidInput'
    );
  })

  .directive('mwCustomErrorValidator', function (mwValidationMessages, i18n) {
    return {
      require: 'ngModel',
      scope: {
        isValid: '=mwIsValid',
        errorMsg: '@mwCustomErrorValidator'
      },
      link: function (scope, elm, attr, ngModel) {
        ngModel.$validators.customValidation = function () {
          var isValid = false;
          if(_.isUndefined(scope.isValid)){
            isValid = true;
          } else {
            isValid = scope.isValid;
          }
          return isValid;
        };

        scope.$watch('isValid', function(){
          mwValidationMessages.updateMessage(
            'customValidation',
            function(){
              if(scope.errorMsg && angular.isString(scope.errorMsg)){
                return scope.errorMsg;
              } else {
                return i18n.get('mwErrorMessages.invalidInput');
              }
            }
          );
          ngModel.$validate();
        });
      }
    };
  });