(function(root, angular){
  'use strict';

  angular.module('mwUI', [
    'mwUI.Layout',
    'mwUI.i18n'
  ]);

  root.mwUI = {};

// @include ../.tmp/templates.js

// @include ./mw-layout/mw_layout.js
// @include ./mw-i18n/mw_i18n.js
// @include ./mw-ui-components/mw_ui_components.js

})(window, angular);