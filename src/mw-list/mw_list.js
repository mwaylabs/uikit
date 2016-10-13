angular.module('mwUI.List', ['mwUI.i18n', 'mwUI.Backbone']);

// @include ./directives/mw_list.js
// @include ./directives/mw_list_body_row.js
// @include ./directives/mw_list_body_row_checkbox.js
// @include ./directives/mw_list_footer_row.js
// @include ./directives/mw_list_head.js
// @include ./directives/mw_list_header.js
// @include ./directives/mw_list_header_row.js
// @include ./directives/mw_list_url_action_button.js

angular.module('mwUI.List')

  .config(function(i18nProvider){
    i18nProvider.addResource('uikit/mw-list/i18n');
  });
