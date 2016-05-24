angular.module('mwUI.Form')

  .directive('mwErrorMessages', function (mwValidationMessages) {
    return {
      require: '^ngModelErrors',
      templateUrl: 'uikit/mw-form/directives/templates/mw_error_messages.html',
      link: function(scope, el, attrs, ngModelErrorsCtrl){
        scope.errors = ngModelErrorsCtrl.getErrors;

        scope.getMessageForError = function(errorModel){
          return mwValidationMessages.getMessageFor(errorModel);
        };
      }
    };
  });