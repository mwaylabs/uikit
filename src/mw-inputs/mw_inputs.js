angular.module('mwUI.Inputs', ['mwUI.i18n', 'mwUI.Backbone']);

// @include ./directives/mw_checkbox.js
// @include ./directives/mw_checkbox_group.js
// @include ./directives/mw_input_defaults.js
// @include ./directives/mw_radio.js
// @include ./directives/mw_radio_group.js
// @include ./directives/mw_select.js
// @include ./directives/mw_select_box.js
// @include ./directives/mw_toggle.js

angular.module('mwUI.Inputs')
  .config(function(i18nProvider) {
    i18nProvider.addResource('uikit/mw-inputs/i18n');
  });