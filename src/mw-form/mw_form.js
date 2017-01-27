angular.module('mwUI.Form', ['mwUI.i18n','mwUI.Modal','mwUI.Utils']);

// @include ./directives/mw_error_messages.js
// @include ./directives/mw_form_defaults.js
// @include ./directives/mw_form_leave_confirmation.js
// @include ./directives/mw_checkbox_wrapper.js
// @include ./directives/mw_input_wrapper.js
// @include ./directives/ng_model.js
// @include ./directives/ng_model_errors.js

// @include ./services/mw_error_messages.js

angular.module('mwUI.Form')

  .config(function(i18nProvider, mwValidationMessagesProvider){
    i18nProvider.addResource('mw-form/i18n', 'uikit');

    mwValidationMessagesProvider.registerValidator('required','mwErrorMessages.required');
    mwValidationMessagesProvider.registerValidator('email','mwErrorMessages.hasToBeValidEmail');
    mwValidationMessagesProvider.registerValidator('pattern','mwErrorMessages.hasToMatchPattern');
    mwValidationMessagesProvider.registerValidator('url','mwErrorMessages.hasToBeValidUrl');
    mwValidationMessagesProvider.registerValidator('phone','mwErrorMessages.hasToBeValidPhoneNumber');
    mwValidationMessagesProvider.registerValidator('min','mwErrorMessages.hasToBeMin');
    mwValidationMessagesProvider.registerValidator('minlength','mwErrorMessages.hasToBeMinLength');
    mwValidationMessagesProvider.registerValidator('max','mwErrorMessages.hasToBeSmaller');
    mwValidationMessagesProvider.registerValidator('maxlength','mwErrorMessages.hasToBeSmallerLength');
  });