(function (root, angular) {
  'use strict';

  angular.module('mwUI', [
      'mwUI.Inputs',
      'mwUI.i18n',
      'mwUI.Layout',
      'mwUI.List',
      'mwUI.Menu',
      'mwUI.Modal',
      'mwUI.Toast',
      'mwUI.UiComponents',
      'mwUI.Utils'
    ])

    .config(function (i18nProvider) {
      i18nProvider.addLocale('de_DE', 'Deutsch', 'de_DE.json');
      i18nProvider.addLocale('en_US', 'English (US)', 'en_US.json');
    })

    .run(function(i18n){
      i18n.setLocale('en_US');
    });

  //This is only for backwards compatibility and should not be used
  window.mCAP = window.mCAP || {};

  root.mwUI = {};

// @include ../.tmp/templates.js

// @include ./mw-utils/mw_utils.js

// @include ./mw-backbone/mw_backbone.js
// @include ./mw-i18n/mw_i18n.js
// @include ./mw-inputs/mw_inputs.js
// @include ./mw-layout/mw_layout.js
// @include ./mw-list/mw_list.js
// @include ./mw-menu/mw_menu.js
// @include ./mw-modal/mw_modal.js
// @include ./mw-toast/mw_toast.js
// @include ./mw-ui-components/mw_ui_components.js

})(window, angular);