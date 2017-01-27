angular.module('mwUI.ExceptionHandler', ['mwUI.Modal', 'mwUI.i18n', 'mwUI.UiComponents', 'mwUI.Utils']);

// @include ./modals/mw_exception_modal.js

// @include ./services/mw_exception_handler.js
// @include ./services/mw_exception_handler_modal.js

angular.module('mwUI.ExceptionHandler').config(function ($exceptionHandlerProvider, i18nProvider) {
  $exceptionHandlerProvider.registerHandler('exceptionHandlerModal');
  i18nProvider.addResource('mw-exception-handler/i18n', 'uikit');
});