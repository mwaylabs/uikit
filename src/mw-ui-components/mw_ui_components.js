angular.module('mwUI.UiComponents', ['mwUI.i18n','mwUI.Utils']);

// @include ./directives/mw_alert.js
// @include ./directives/mw_arrow_link.js
// @include ./directives/mw_badge.js
// @include ./directives/mw_bread_crumb.js
// @include ./directives/mw_bread_crumbs_holder.js
// @include ./directives/mw_button_help.js
// @include ./directives/mw_button_help_condition.js
// @include ./directives/mw_collapsible.js
// @include ./directives/mw_indefinite_loading.js
// @include ./directives/mw_icon.js
// @include ./directives/mw_option_group.js
// @include ./directives/mw_panel.js
// @include ./directives/mw_spinner.js
// @include ./directives/mw_star_rating.js
// @include ./directives/mw_tab_bar.js
// @include ./directives/mw_tab_pane.js
// @include ./directives/mw_text_collapsible.js
// @include ./directives/mw_timeline.js
// @include ./directives/mw_timeline_entry.js
// @include ./directives/mw_timeline_fieldset.js
// @include ./directives/mw_tooltip.js
// @include ./directives/mw_view_change_loader.js
// @include ./directives/mw_wizard.js
// @include ./directives/mw_wizard_navigation.js
// @include ./directives/mw_wizard_progress.js
// @include ./directives/mw_wizard_step.js

// @include ./services/mw_icon.js
// @include ./services/mw_wizard.js

angular.module('mwUI.UiComponents')

  .config(function(i18nProvider){
    i18nProvider.addResource('uikit/mw-ui-components/i18n');
  });