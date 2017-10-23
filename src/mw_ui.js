(function (root, angular) {
  'use strict';

  angular.module('mwUI', [
      'mwUI.Backbone',
      'mwUI.ExceptionHandler',
      'mwUI.Form',
      'mwUI.Inputs',
      'mwUI.i18n',
      'mwUI.Layout',
      'mwUI.List',
      'mwUI.Menu',
      'mwUI.Modal',
      'mwUI.ResponseHandler',
      'mwUI.Toast',
      'mwUI.ResponseToastHandler',
      'mwUI.Utils',
      'mwUI.UiComponents'
    ])

    .config(function (i18nProvider, mwIconProvider) {
      i18nProvider.addLocale('de_DE', 'Deutsch', 'de_DE.json');
      i18nProvider.addLocale('en_US', 'English (US)', 'en_US.json');

      mwIconProvider.addIconSet({
        id: 'mwUI',
        classPrefix: 'fa',
        iconsUrl:'uikit/mw_ui_icons.json'
      }, true);

    })

    .run(function(i18n){
      i18n.setLocale('en_US');
    });

  //This is only for backwards compatibility and should not be used
  window.mCAP = window.mCAP || {};

  root.mwUI = {};

  //Will be replaced with the actual version number duringh the build process;
  //DO NOT TOUCH
  root.mwUI.VERSION = 'UIKITVERSIONNUMBER';

// @include ../.tmp/templates.js

// @include ./mw-backbone/mw_backbone.js
// @include ./mw-utils/mw_utils.js

// @include ./mw-exception-handler/mw_exception_handler.js
// @include ./mw-form/mw_form.js
// @include ./mw-i18n/mw_i18n.js
// @include ./mw-inputs/mw_inputs.js
// @include ./mw-layout/mw_layout.js
// @include ./mw-list/mw_list.js
// @include ./mw-menu/mw_menu.js
// @include ./mw-modal/mw_modal.js
// @include ./mw-response-toast-handler/mw_response_toast_handler.js
// @include ./mw-response-handler/mw_response_handler.js
// @include ./mw-toast/mw_toast.js
// @include ./mw-ui-components/mw_ui_components.js

})(window, angular);