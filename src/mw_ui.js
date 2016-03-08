(function (root, angular) {
  'use strict';

  angular.module('mwUI', [
    'mwUI.Backbone',
    'mwUI.Inputs',
    'mwUI.i18n',
    'mwUI.Layout',
    'mwUI.Menu',
    'mwUI.UiComponents',
    'mwUI.Utils'
  ]);

  root.mwUI = {};

// @include ../.tmp/templates.js

// @include ./mw-utils/mw_utils.js

// @include ./mw-backbone/mw_backbone.js
// @include ./mw-i18n/mw_i18n.js
// @include ./mw-inputs/mw_inputs.js
// @include ./mw-layout/mw_layout.js
// @include ./mw-menu/mw_menu.js
// @include ./mw-ui-components/mw_ui_components.js

})(window, angular);