angular.module('mwUI.List', ['mwUI.i18n', 'mwUI.Backbone', 'mwUI.UiComponents']);

window.mwUI.List = {
  localStoragePrefix: 'tbl_confg_v1'
};

// @include ./models/mw_table_column.js
// @include ./models/mw_table_configurator.js

// @include ./collections/mw_table_columns.js
// @include ./collections/mw_table_configurators.js

// @include ./directives/mw_list.js
// @include ./directives/mw_list_action_button.js
// @include ./directives/mw_list_body_row.js
// @include ./directives/mw_list_body_row_checkbox.js
// @include ./directives/mw_list_column_configurator.js
// @include ./directives/mw_list_footer_row.js
// @include ./directives/mw_list_head.js
// @include ./directives/mw_list_header.js
// @include ./directives/mw_list_header_row.js
// @include ./directives/mw_list_url_action_button.js

// @include ./services/mw_table_column_configurator.js

angular.module('mwUI.List')

  .config(function(i18nProvider){
    i18nProvider.addResource('mw-list/i18n', 'uikit');
  });
