angular.module('mwUI.Form', ['mwUI.i18n','mwUI.Modal','mwUI.Utils']);

// @include ./directives/mw_error_messages.js
// @include ./directives/mw_form_defaults.js
// @include ./directives/mw_form_leave_confirmation.js
// @include ./directives/mw_input_wrapper.js
// @include ./directives/ng_model.js
// @include ./directives/ng_model_errors.js

// @include ./services/mw_error_messages.js

angular.module('mwUI.Form')

  .config(function(i18nProvider, mwValidationMessagesProvider){
    i18nProvider.addResource('uikit/mw-form/i18n');

    mwValidationMessagesProvider.registerValidator('required','mwErrorMessages.required');
    mwValidationMessagesProvider.registerValidator('email','mwErrorMessages.hasToBeValidEmail');
    mwValidationMessagesProvider.registerValidator('pattern','mwErrorMessages.hasToMatchPattern');
    mwValidationMessagesProvider.registerValidator('url','mwErrorMessages.hasToBeValidUrl');
    mwValidationMessagesProvider.registerValidator('phone','mwErrorMessages.hasToBeValidPhoneNumber');
    mwValidationMessagesProvider.registerValidator('min',function(i18n, attrs){
      return i18n.get('mwErrorMessages.hasToBeMin',{min: attrs.min});
    });
    mwValidationMessagesProvider.registerValidator('minlength',function(i18n, attrs){
      return i18n.get('mwErrorMessages.hasToBeMinLength',{min: attrs.minlength});
    });
    mwValidationMessagesProvider.registerValidator('max',function(i18n, attrs){
      return i18n.get('mwErrorMessages.hasToBeSmaller',{max: attrs.max});
    });
    mwValidationMessagesProvider.registerValidator('maxlength',function(i18n, attrs){
      return i18n.get('mwErrorMessages.hasToBeSmallerLength',{max: attrs.maxlength});
    });
  });