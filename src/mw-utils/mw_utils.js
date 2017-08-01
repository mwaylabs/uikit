/**
 * Created by zarges on 17/02/16.
 */
angular.module('mwUI.Utils', ['mwUI.i18n','mwUI.Modal']);

window.mwUI.Utils = {};
window.mwUI.Utils.shims = {};

// @include ./directives/mw_append_route_class.js
// @include ./directives/mw_draggable.js
// @include ./directives/mw_droppable.js
// @include ./directives/mw_infinite_scroll.js
// @include ./directives/mw_leave_confirmation.js
// @include ./directives/mw_prevent_default.js
// @include ./directives/mw_stop_propagation.js

// @include ./filters/mw_reduce_string_to.js

// @include ./modals/mw_leave_confirmation_modal.js

// @include ./services/mw_browser_title_handler.js
// @include ./services/mw_callback_handler.js
// @include ./services/mw_url_storage.js

// @include ./shims/deep_extend_object.js
// @include ./shims/dom_observer.js
// @include ./shims/route_to_regex.js
// @include ./shims/deprecation_warning.js

angular.module('mwUI.Utils').config(function(i18nProvider){
  i18nProvider.addResource('mw-utils/i18n', 'uikit');
});