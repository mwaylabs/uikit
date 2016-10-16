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

    .config(['i18nProvider', 'mwIconProvider', function (i18nProvider, mwIconProvider) {
      i18nProvider.addLocale('de_DE', 'Deutsch', 'de_DE.json');
      i18nProvider.addLocale('en_US', 'English (US)', 'en_US.json');

      mwIconProvider.addIconSet({
        id: 'mwUI',
        classPrefix: 'fa',
        iconsUrl:'uikit/mw_ui_icons.json'
      }, true);

    }])

    .run(['i18n', function(i18n){
      i18n.setLocale('en_US');
    }]);

  //This is only for backwards compatibility and should not be used
  window.mCAP = window.mCAP || {};

  root.mwUI = {};

  //Will be replaced with the actual version number duringh the build process;
  //DO NOT TOUCH
  root.mwUI.VERSION = '1.0.1-b21';

angular.module("mwUI").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('uikit/mw-exception-handler/modals/templates/mw_exception_modal.html',
    "<div mw-modal title=\"{{'ExceptionHandler.mwExceptionModal.title' | i18n}}\"><div mw-modal-body><div mw-wizard=\"wizard\"><div mw-wizard-step><p>{{'ExceptionHandler.mwExceptionModal.unknownError' | i18n}}</p><div ng-if=\"exception && (displayException || !successCallback)\" mw-alert=\"danger\"><p>{{exception}}</p></div><div ng-if=\"userCanEnterMessage && successCallback\"><p class=\"text-muted\">{{'ExceptionHandler.mwExceptionModal.userMessage' | i18n}}</p><textarea name=\"description\" ng-attr-placeholder=\"{{'ExceptionHandler.mwExceptionModal.userMessagePlaceholder' | i18n}}\" ng-model=\"model.bugDescription\">\n" +
    "\n" +
    "          </textarea></div></div><div mw-wizard-step><div mw-alert=\"success\">{{'ExceptionHandler.mwExceptionModal.thanks' | i18n}}</div></div></div></div><div mw-modal-footer><button ng-if=\"wizard.getCurrentStepNumber()!==1\" type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">{{'Utils.cancel' | i18n }}</button> <button ng-if=\"wizard.getCurrentStepNumber()===1 || !successCallback\" type=\"button\" ng-click=\"close()\" class=\"btn btn-primary\">{{'Utils.ok' | i18n }}</button> <button ng-if=\"wizard.getCurrentStepNumber()===0 && successCallback\" type=\"button\" ng-click=\"report()\" class=\"btn btn-primary\">{{'ExceptionHandler.mwExceptionModal.report' | i18n}}</button></div></div>"
  );


  $templateCache.put('uikit/mw-form/directives/templates/mw_checkbox_wrapper.html',
    "<div class=\"mw-checkbox-wrapper form-group\"><div class=\"col-sm-offset-3 col-sm-9\"><div class=\"checkbox\"><label><div ng-transclude></div><span class=\"text-holder\">{{ label }}</span></label><span ng-if=\"tooltip\" mw-icon=\"rln-icon support\" tooltip=\"{{ tooltip }}\"></span></div></div></div>"
  );


  $templateCache.put('uikit/mw-form/directives/templates/mw_error_messages.html',
    "<div class=\"mw-error-messages\"><ul ng-repeat=\"errorModel in errors().models\"><li class=\"error-message\">{{getMessageForError(errorModel)}}</li></ul></div>"
  );


  $templateCache.put('uikit/mw-form/directives/templates/mw_input_wrapper.html',
    "<div class=\"mw-input-wrapper form-group input-{{getType()}}\" ng-model-errors ng-class=\"{\n" +
    "      'is-required': isRequired(),\n" +
    "      'is-focused': isFocused(),\n" +
    "      'is-touched': isTouched(),\n" +
    "      'is-dirty': isDirty(),\n" +
    "      'is-invalid': !isValid(),\n" +
    "      'is-required-error':hasRequiredError(),\n" +
    "      'has-error': hasError()\n" +
    "     }\"><div class=\"clearfix\"><label ng-if=\"label\" class=\"col-sm-3 control-label\">{{ label }} <span ng-if=\"tooltip\" mw-tooltip=\"{{ tooltip }}\"><span mw-icon=\"mwUI.questionCircle\"></span></span></label><div class=\"input-holder\" ng-class=\"{ true: 'col-sm-6 col-lg-5', false: 'col-sm-12' }[label.length > 0]\" ng-transclude></div></div><div ng-if=\"!hideErrors\" ng-class=\"{ true: 'col-sm-6 col-sm-offset-3', false: 'col-sm-12' }[label.length > 0]\"><div mw-error-messages></div></div></div>"
  );


  $templateCache.put('uikit/mw-inputs/directives/templates/mw_checkbox_group.html',
    "<fieldset class=\"mw-checkbox-group\" ng-disabled=\"mwDisabled\"><div ng-repeat=\"model in mwOptionsCollection.models\"><label><input type=\"checkbox\" ng-disabled=\"isOptionDisabled(model)\" ng-checked=\"mwCollection.findWhere(model.toJSON())\" ng-click=\"toggleModel(model); setDirty()\"> <span class=\"checkbox-label\">{{getLabel(model)}}</span></label></div><input type=\"hidden\" ng-model=\"viewModel.tmp\" ng-required=\"mwRequired\" mw-collection=\"mwCollection\"></fieldset>"
  );


  $templateCache.put('uikit/mw-inputs/directives/templates/mw_radio_group.html',
    "<fieldset class=\"mw-radio-group\" ng-disabled=\"mwDisabled\"><div ng-repeat=\"model in mwOptionsCollection.models\"><label><input type=\"radio\" ng-disabled=\"isOptionDisabled(model)\" ng-checked=\"isChecked(model)\" name=\"{{radioGroupId}}\" ng-click=\"selectOption(model);\"> <span class=\"radio-label\">{{getLabel(model)}}</span></label></div><input type=\"hidden\" ng-model=\"viewModel.tmp\" ng-required=\"mwRequired\" mw-model=\"mwModel\" mw-model-attr=\"{{getModelAttribute()}}\"></fieldset>"
  );


  $templateCache.put('uikit/mw-inputs/directives/templates/mw_select_box.html',
    "<select ng-disabled=\"mwDisabled\" ng-required=\"mwRequired\" ng-model=\"viewModel.selected\" ng-change=\"select(viewModel.selected)\"><option value=\"\" ng-if=\"hasPlaceholder()\" ng-disabled=\"mwRequired\">{{getPlaceholder()}}</option><option value=\"\" ng-if=\"!hasPlaceholder()\"></option><option ng-repeat=\"model in mwOptionsCollection.models\" value=\"{{model.id}}\" ng-disabled=\"isOptionDisabled(model)\" ng-selected=\"isChecked(model)\" ng-click=\"selectOption(model)\">{{getLabel(model)}}</option></select>"
  );


  $templateCache.put('uikit/mw-inputs/directives/templates/mw_toggle.html',
    "<div class=\"mw-toggle\"><button class=\"no toggle btn btn-link\" ng-click=\"toggle(true)\" ng-disabled=\"mwDisabled\"><span>{{ 'UiComponents.mwToggle.on' | i18n }}</span></button> <button class=\"yes toggle btn btn-link\" ng-click=\"toggle(false)\" ng-disabled=\"mwDisabled\"><span>{{ 'UiComponents.mwToggle.off' | i18n }}</span></button> <span class=\"label indicator\" ng-class=\"{ true: 'label-success enabled', false: 'label-danger' }[mwModel]\"></span></div>"
  );


  $templateCache.put('uikit/mw-layout/directives/templates/mw_app.html',
    "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><title>Title</title></head><body></body></html>"
  );


  $templateCache.put('uikit/mw-layout/directives/templates/mw_header.html',
    "<div class=\"mw-header row\"><div class=\"fixed-content col-md-12\"><div ng-if=\"showBackButton\" class=\"back-btn clickable\" data-text=\"{{'common.back' | i18n}}\" ng-click=\"back()\"><span mw-icon=\"mwUI.angleLeft\"></span></div><div class=\"title-holder\"><span mw-icon=\"{{mwTitleIcon}}\" class=\"header-icon\" ng-if=\"mwTitleIcon\"></span><div ng-if=\"mwBreadCrumbs\" mw-bread-crumbs-holder><div ng-repeat=\"breadCrumb in mwBreadCrumbs\" mw-bread-crumb url=\"{{breadCrumb.url}}\" title=\"{{breadCrumb.title}}\" show-arrow=\"true\"></div></div><h1 class=\"lead page-title\" ng-click=\"refresh()\">{{title}}</h1></div><div ng-if=\"warningCondition\" class=\"warnin-content\" mw-tooltip=\"{{ warningText }}\"><span class=\"text-warning\" mw-icon=\"mwUI.warning\"></span> <span class=\"popover-container\"></span></div><div class=\"additional-content-holder\" ng-transclude></div></div></div>"
  );


  $templateCache.put('uikit/mw-layout/directives/templates/mw_sub_nav.html',
    "<div class=\"row\"><div class=\"mw-sub-nav col-md-12\"><ul class=\"nav nav-pills\" ng-class=\"{'nav-justified':justified}\" ng-transclude></ul></div></div>"
  );


  $templateCache.put('uikit/mw-layout/directives/templates/mw_sub_nav_pill.html',
    "<li class=\"mw-sub-nav-pill\" ng-class=\"{mwDisabled: mwDisabled}\"><div class=\"btn btn-link\" ng-click=\"navigate(url)\" ng-class=\"{disabled: mwDisabled}\" ng-transclude></div></li>"
  );


  $templateCache.put('uikit/mw-list/directives/templates/mw_list_body_row_checkbox.html',
    "<input ng-if=\"!isSingleSelection\" type=\"checkbox\" ng-click=\"click(item, $event)\" ng-disabled=\"item.selectable.isDisabled()\" ng-checked=\"item.selectable.isSelected()\"> <input ng-if=\"isSingleSelection\" type=\"radio\" name=\"{{selectable.id}}\" ng-click=\"click(item, $event)\" ng-disabled=\"item.selectable.isDisabled()\" ng-checked=\"item.selectable.isSelected()\">"
  );


  $templateCache.put('uikit/mw-list/directives/templates/mw_list_footer.html',
    "<tr class=\"mw-list-footer\"><td colspan=\"{{ columns.length + 4 }}\"><div ng-if=\"showSpinner()\"><div mw-spinner></div></div><div ng-if=\"collection.models.length < 1\" class=\"text-center\"><p class=\"lead\">{{ 'List.mwListFooter.noneFound' | i18n }}</p></div></td></tr>"
  );


  $templateCache.put('uikit/mw-list/directives/templates/mw_list_head.html',
    "<div class=\"mw-listable-header clearfix\" ng-class=\"{'show-selected':canShowSelected(),'has-selection-control':!selectable.isSingleSelection() || selectedAmount > 0}\"><div class=\"selection-controller\"><div ng-if=\"selectable\" class=\"holder\"><span ng-click=\"toggleSelectAll()\" class=\"clickable select-all\" ng-if=\"!selectable.isSingleSelection()\"><span class=\"selected-icon\"><span class=\"indicator\" ng-if=\"selectable.allSelected()\"></span></span> <a href=\"#\" mw-prevent-default=\"click\">{{'List.mwListHead.selectAll' | i18n }}</a></span> <span ng-if=\"selectedAmount > 0\" class=\"clickable clear\" ng-click=\"selectable.unSelectAll()\"><span mw-icon=\"mwUI.cross\"></span> <a href=\"#\" mw-prevent-default=\"click\">{{'List.mwListHead.clearSelection' | i18n}}</a></span></div></div><div class=\"search-bar\"><div ng-if=\"searchAttribute\" mw-filterable-search-bb collection=\"collection\" placeholder=\"{{'List.mwListHead.searchFor' | i18n:{name: collectionName} }}\" property=\"{{searchAttribute}}\"></div></div><div class=\"selected-counter\"><span ng-if=\"selectable && selectedAmount>0\" class=\"clickable\" ng-click=\"toggleShowSelected()\"><a href=\"#\" mw-prevent-default=\"click\"><span ng-if=\"selectedAmount === 1\">{{'List.mwListHead.itemSelected' | i18n:{name: getModelAttribute(selectable.getSelected().first())} }}</span> <span ng-if=\"selectedAmount > 1\">{{'List.mwListHead.itemsSelected' | i18n:{name: collectionName, count: selectedAmount} }}</span> <span mw-icon=\"mwUI.angleUp\" ng-show=\"canShowSelected()\"></span> <span mw-icon=\"mwUI.angleDown\" ng-show=\"!canShowSelected()\"></span></a></span><div ng-if=\"!selectable || selectedAmount<1\" ng-transclude class=\"extra-content\"></div><span ng-if=\"!selectable || selectedAmount<1\">{{'List.mwListHead.itemAmount' | i18n:{name: collectionName, count: getTotalAmount()} }}</span></div><div class=\"selected-items\" ng-if=\"canShowSelected()\"><div class=\"items clearfix\"><div class=\"box-shadow-container\"><div ng-if=\"!isLoadingModelsNotInCollection\" ng-repeat=\"item in selectable.getSelected().models\" ng-click=\"unSelect(item)\" ng-class=\"{'label-danger':item.selectable.isDeletedItem}\" class=\"label label-default clickable\"><span ng-if=\"item.selectable.isDeletedItem\" mw-tooltip=\"{{'List.mwListHead.notAvailableTooltip' | i18n}}\"><span mw-icon=\"mwUI.warning\"></span>{{'List.mwListHead.notAvailable' | i18n}}</span> <span ng-if=\"!item.selectable.isDeletedItem\">{{getModelAttribute(item)}}</span> <span mw-icon=\"mwUI.cross\"></span></div><div ng-if=\"isLoadingModelsNotInCollection\"><div rln-spinner></div></div></div></div><div class=\"close-pane\" ng-click=\"hideSelected()\"></div></div></div>"
  );


  $templateCache.put('uikit/mw-list/directives/templates/mw_list_header.html',
    "<th ng-class=\"{ clickable: canBeSorted(), 'sort-active':(canBeSorted() && isSelected()) }\" class=\"mw-list-header\" ng-click=\"toggleSortOrder()\"><span ng-if=\"canBeSorted()\" class=\"sort-indicators\"><i ng-show=\"!isSelected()\" mw-icon=\"mwUI.sort\" class=\"sort-indicator\"></i> <i ng-if=\"isSelected('-')\" mw-icon=\"mwUI.sortAsc\"></i> <i ng-if=\"isSelected('+')\" mw-icon=\"mwUI.sortDesc\"></i></span> <span ng-transclude class=\"title\"></span></th>"
  );


  $templateCache.put('uikit/mw-menu/directives/templates/mw_menu.html',
    "<div class=\"mw-menu\"><div ng-repeat=\"entry in menu.models\" mw-menu-entry=\"entry\"></div></div>"
  );


  $templateCache.put('uikit/mw-menu/directives/templates/mw_menu_entry.html',
    "<div class=\"mw-menu-entry\" ng-class=\"{active:menuEntryCtrl.isActive}\"><div class=\"mw-icon\"><span class=\"fa fa-user\"></span></div><div class=\"extended-content\"><span class=\"entry-label\">{{menuEntryCtrl.entry.get('label')}}</span><div class=\"sub-entries\" ng-repeat=\"subEntry in menuEntryCtrl.entry.get('subEntries').models\" mw-menu-sub-entry=\"subEntry\"></div></div></div>"
  );


  $templateCache.put('uikit/mw-menu/directives/templates/mw_menu_sub_entry.html',
    "<div class=\"mw-menu-sub-entry\" ng-class=\"{active: menuSubEntryCtrl.isActive}\"><div class=\"entry-label\"><span>{{menuSubEntryCtrl.entry.get('label')}}</span></div></div>"
  );


  $templateCache.put('uikit/mw-menu/directives/templates/mw_sidebar_menu.html',
    "<div class=\"mw-sidebar-menu\" ng-class=\"{opened:ctrl.isOpened()}\"><div ng-if=\"ctrl.mwMenuLogo\" class=\"logo\"><img ng-src=\"{{ctrl.mwMenuLogo}}\"></div><div mw-menu=\"ctrl.mwMenu\"></div><div class=\"additional-content\" ng-transclude></div><div class=\"opener clickable\" ng-click=\"ctrl.toggleState()\"><span class=\"mw-icon\"><span ng-if=\"ctrl.isOpened()\" class=\"fa fa-angle-left\"></span> <span ng-if=\"!ctrl.isOpened()\" class=\"fa fa-angle-right\"></span></span></div></div>"
  );


  $templateCache.put('uikit/mw-modal/directives/templates/mw_modal.html',
    "<div class=\"modal fade\" tabindex=\"-1\" role=\"dialog\"><div class=\"modal-dialog\" role=\"document\"><div class=\"modal-content\"><div class=\"modal-header clearfix\" ng-if=\"title\"><img ng-if=\"mwModalTmpl.getLogoPath()\" ng-src=\"{{mwModalTmpl.getLogoPath()}}\" class=\"pull-left logo\"><h4 class=\"modal-title pull-left\">{{ title }}</h4></div><div class=\"body-holder\"><div mw-toasts class=\"notifications\"></div><div ng-transclude class=\"modal-content-wrapper\"></div></div></div></div></div>"
  );


  $templateCache.put('uikit/mw-modal/directives/templates/mw_modal_body.html',
    "<div class=\"modal-body clearfix\" ng-transclude></div>"
  );


  $templateCache.put('uikit/mw-modal/directives/templates/mw_modal_confirm.html',
    "<div mw-modal title=\"{{ 'Modal.mwModalConfirm.areYouSure' | i18n }}\"><div mw-modal-body><div ng-transclude></div></div><div mw-modal-footer><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"cancel()\">{{'Utils.cancel' | i18n }}</button> <button type=\"button\" mw-modal-on-enter class=\"btn btn-primary\" data-dismiss=\"modal\" ng-click=\"ok()\">{{'Utils.ok' | i18n }}</button></div></div>"
  );


  $templateCache.put('uikit/mw-modal/directives/templates/mw_modal_footer.html',
    "<div class=\"modal-footer\" ng-transclude></div>"
  );


  $templateCache.put('uikit/mw-toast/directives/templates/mw_toasts.html',
    "<div class=\"message messages-list mw-toasts\"><div class=\"content\"><ul><li ng-repeat=\"toast in toasts\" class=\"message-item\"><div class=\"status-indicator {{toast.type}}\"><span mw-icon=\"{{toast.icon}}\"></span></div><div class=\"message\"><div class=\"holder margin-top-5\"><h5 ng-if=\"toast.title\">{{toast.title}}</h5><span ng-if=\"!toast.isHtmlMessage\">{{toast.message | limitTo:500}}</span> <span ng-if=\"toast.isHtmlMessage\" ng-bind-html=\"toast.message\"></span> <a class=\"action-button btn btn-link btn-xs\" ng-if=\"toast.button && toast.button.isLink && toast.button.action && !toast.button.link\" href=\"#\"><span ng-click=\"hideToast(toast); toast.button.action()\" mw-prevent-default=\"click\">{{toast.button.title}}</span></a> <a class=\"action-button btn btn-link btn-xs\" ng-if=\"toast.button && toast.button.isLink && toast.button.link\" ng-href=\"{{toast.button.link}}\" target=\"{{toast.button.target}}\"><span>{{toast.button.title}}</span></a><div ng-if=\"toast.button && !toast.button.isLink && toast.button.action\"><div class=\"action-button btn btn-default btn-xs margin-top-5\"><div ng-click=\"hideToast(toast); toast.button.action()\">{{toast.button.title}}</div></div></div></div><div class=\"closer\" ng-click=\"hideToast(toast.id)\"><span mw-icon=\"mwUI.cross\"></span></div></div></li></ul></div></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_alert.html',
    "<div class=\"mw-alert alert alert-{{ type || 'default' }}\"><div ng-transclude class=\"alert-content\"></div><div ng-if=\"closeable\" ng-click=\"closeAlert()\" mw-icon=\"mwUI.cross\"></div></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_arrow_link.html',
    "<a ng-href=\"{{ link }}\" class=\"btn btn-default btn-sm mw-arrow-link\" mw-stop-propagation=\"click\"><span mw-icon=\"mwUI.angleRight\"></span></a>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_badge.html',
    "<span class=\"mw-badge label label-{{mwBadge}}\" ng-transclude></span>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_bread_crumb.html',
    "<div class=\"mw-bread-crumb\"><a ng-href=\"{{url}}\" class=\"bread-crumb\">{{title}}</a> <span mw-icon=\"mwUI.caretRight\" class=\"arrow\"></span></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_bread_crumbs_holder.html',
    "<div class=\"mw-bread-crumbs-holder\" ng-transclude></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_collapsible.html',
    "<div class=\"mw-collapsible\"><div class=\"mw-collapsible-heading\" ng-click=\"toggle()\"><i class=\"fa fa-angle-right\" ng-class=\"{'fa-rotate-90': viewModel.collapsed}\"></i> <span class=\"mw-collapsible-heading-text\">{{title}}</span></div><div class=\"mw-collapsible-body mw-collapsible-animate margin-top-5\" ng-class=\"{'collapsed': viewModel.collapsed}\" ng-transclude></div></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_icon.html',
    "<span class=\"mw-icon\"><i ng-if=\"viewModel.oldIcon\" ng-class=\"viewModel.oldIcon\" style=\"{{style}}\" mw-tooltip=\"{{tooltip}}\" placement=\"{{placement}}\"></i> <i ng-if=\"viewModel.icon\" ng-class=\"viewModel.iconSet.get('classPrefix') +' '+ viewModel.icon\" style=\"{{style}}\" mw-tooltip=\"{{tooltip}}\" placement=\"{{placement}}\"></i></span>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_indefinite_loading.html',
    "<div class=\"mw-infinite-loading\"><div class=\"col-md-12 text-center\"><div mw-spinner></div><div class=\"lead\">{{'UiComponents.mwIndefiniteLoading.loading' | i18n | uppercase}}</div></div></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_option_group.html',
    "<div class=\"mw-option-group panel panel-default\"><fieldset ng-disabled=\"mwDisabled\"><div class=\"panel-body\"><span ng-transclude></span><label class=\"options-container display-inline clickable\" ng-class=\"{'with-icon':icon}\" for=\"{{randomId}}\"><div class=\"clearfix\"><div ng-if=\"icon\" class=\"col-md-1 icon-holder\"><span mw-icon=\"{{icon}}\"></span></div><div class=\"description\" ng-class=\"{'col-md-11': icon, 'col-md-12': !icon}\"><h4>{{title}}</h4><p>{{description}}</p></div></div></label></div></fieldset></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_panel.html',
    "<div class=\"mw-panel panel panel-{{type || 'default'}}\"><div class=\"panel-heading\" ng-if=\"title\"><h3 class=\"panel-title\">{{title}}</h3><span ng-if=\"closeable\" ng-click=\"closePanel()\" mw-icon=\"mwUI.cross\"></span></div><div class=\"panel-body\" ng-transclude></div></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_spinner.html',
    "<div class=\"mw-spinner\"></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_star_rating.html',
    "<span class=\"mw-star-rating\"><i ng-repeat=\"star in stars\" ng-class=\"star.state\" class=\"fa\"></i></span>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_tab_bar.html',
    "<div class=\"clearfix mw-tab-bar\" ng-class=\"{justified: justified}\"><ul class=\"nav nav-tabs\" ng-class=\"{ 'nav-justified': justified }\"><li ng-repeat=\"pane in panes\" ng-class=\"{ active: pane.selected }\"><a ng-class=\"{ 'has-error': pane.isInvalid }\" ng-click=\"select(pane)\">{{ pane.title }}</a></li></ul><div class=\"tab-content\" ng-transclude></div></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_tab_pane.html',
    "<div class=\"tab-pane mw-tab-pane\" role=\"tabpanel\" ng-class=\"{active: selected}\" ng-transclude></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_text_collapsible.html',
    "<div class=\"mw-text-collapsible\"><span class=\"line-break content\">{{ text() }}</span> <a ng-if=\"showButton\" ng-click=\"toggleLength()\" class=\"toggle-btn\">{{ showLessOrMore() | i18n }}</a></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_timeline.html',
    "<div class=\"mw-timeline timeline clearfix\"><hr class=\"vertical-line\"><div class=\"content\" ng-transclude></div></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_timeline_entry.html',
    "<li class=\"timeline-entry\"><span class=\"bubble\"></span><div ng-transclude></div></li>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_timeline_fieldset.html',
    "<fieldset class=\"mw-timeline-fieldset\" ng-class=\"{'entries-are-hidden':!entriesVisible, 'collapsable': collapsable}\"><div ng-if=\"mwTitle\" ng-click=\"toggleEntries()\" class=\"legend\">{{mwTitle}} <span ng-if=\"collapsable && entriesVisible\" class=\"toggler\"><i mw-icon=\"mwUI.chevronDownCircle\"></i></span> <span ng-if=\"collapsable && !entriesVisible\" class=\"toggler\"><i mw-icon=\"mwUI.chevronUpCircle\"></i></span></div><div ng-show=\"!entriesVisible\" class=\"hidden-entries\" ng-click=\"toggleEntries()\">{{ hiddenEntriesText() | i18n:{count:entries.length} }}</div><ul class=\"clearfix timeline-entry-list\" ng-transclude ng-show=\"entriesVisible\"></ul></fieldset>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_view_change_loader.html',
    "<div class=\"mw-view-change-loader\" ng-if=\"viewModel.loading\"><div mw-spinner></div></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_wizard.html',
    "<div class=\"mw-wizard\" ng-transclude></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_wizard_navigation.html',
    "<div class=\"mw-wizard-navigation\"><button class=\"btn btn-default\" ng-disabled=\"!wizard.hasPreviousStep()\" ng-click=\"wizard.back()\">Previous</button> <button class=\"btn btn-primary\" ng-if=\"wizard.hasNextStep() || (!wizard.hasNextStep() && !finishedAction)\" ng-disabled=\"!wizard.hasNextStep()\" ng-click=\"wizard.next()\">Next</button> <button class=\"btn btn-primary\" ng-if=\"!wizard.hasNextStep() && finishedAction\" ng-click=\"finish()\">OK</button><div class=\"extra-content\" ng-transclude></div></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_wizard_progress.html',
    "<div class=\"mw-wizard-progress\"><div class=\"bar\"><div class=\"current-progress\" ng-style=\"{width:getProgress()+'%'}\"></div></div></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_wizard_step.html',
    "<div class=\"mw-wizard-step\" ng-class=\"{active:_isActive}\" ng-show=\"_isActive\"><div ng-if=\"_isActive\" class=\"mw-wizard-step-inner\" ng-transclude></div></div>"
  );


  $templateCache.put('uikit/mw-utils/modals/templates/mw_leave_confirmation_modal.html',
    "<div mw-modal title=\"{{'Utils.mwLeaveConfirmationModal.title' | i18n}}\"><div mw-modal-body><p>{{ text }}</p></div><div mw-modal-footer><button type=\"button\" class=\"btn btn-default\" ng-click=\"stay()\">{{'Utils.mwLeaveConfirmationModal.stay' | i18n }}</button> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"continue()\">{{'Utils.mwLeaveConfirmationModal.continue' | i18n }}</button></div></div>"
  );


  $templateCache.put('uikit/templates/mwSidebarBb/mwSidebarInput.html',
    "<div class=\"row\"><div class=\"col-md-12 form-group\" ng-class=\"{'has-error': !isValid()}\" style=\"margin-bottom: 0\"><input type=\"{{_type}}\" ng-if=\"!customUrlParameter\" class=\"form-control\" ng-model=\"viewModel.val\" ng-change=\"changed()\" ng-disabled=\"mwDisabled\" placeholder=\"{{placeholder}}\" ng-model-options=\"{ debounce: 500 }\"><input type=\"{{_type}}\" ng-if=\"customUrlParameter\" class=\"form-control\" ng-model=\"viewModel.val\" ng-change=\"changed()\" ng-disabled=\"mwDisabled\" placeholder=\"{{placeholder}}\" ng-model-options=\"{ debounce: 500 }\"></div></div>"
  );


  $templateCache.put('uikit/mw-exception-handler/i18n/de_DE.json',
    "{ \"ExceptionHandler\": { \"mwExceptionModal\": { \"title\": \"Es ist etwas schiefgelaufen\", \"unknownError\": \"Leider ist ein unvorhergesehener Fehler aufgetreten. Sie können uns einen Fehlerbericht senden, sodass wir diesen schnellst möglich beseitigen können. Vielen Dank.\", \"userMessage\": \"Sie können uns zusätzlich ihre letzten Schritte beschreiben, sodass wir den Fehler schneller nachstellen können.\", \"userMessagePlaceholder\": \"(Optional)\", \"report\": \"Fehler melden\", \"thanks\": \"Vielen Dank für Ihre Rückmeldung. Wir werden uns umgehend um diesen Fehler kümmern.\" } } }"
  );


  $templateCache.put('uikit/mw-exception-handler/i18n/en_US.json',
    "{ \"ExceptionHandler\": { \"mwExceptionModal\": { \"title\": \"Something went wrong\", \"unknownError\": \"Unfortunatly something went wrong. You can report this error so we can fix it. Thank you.\", \"userMessage\": \"You can leave some additional information to make it easier for us to reproduce the error\", \"userMessagePlaceholder\": \"(Optional)\", \"report\": \"Report error\", \"thanks\": \"Thanks for your feedback. We will have a look at this error as soon as possible.\" } } }"
  );


  $templateCache.put('uikit/mw-form/i18n/de_DE.json',
    "{ \"mwErrorMessages\": { \"required\": \"ist ein Pflichtfeld\", \"hasToBeValidEmail\": \"muss eine valide E-Mail Adresse sein\", \"hasToMatchPattern\": \"muss dem Muster entsprechen\", \"hasToBeValidUrl\": \"muss eine valide URL sein\", \"hasToBeValidPhoneNumber\": \"muss eine gültige Telefonnummer sein\", \"hasToBeMin\": \"muss mindestens {{min}} sein\", \"hasToBeMinLength\": \"muss mindestens {{ngMinlength}} Zeichen haben\", \"hasToBeSmaller\": \"darf maximal {{max}} sein\", \"hasToBeSmallerLength\": \"darf maximal {{ngMaxlength}} Zeichen haben\" } }"
  );


  $templateCache.put('uikit/mw-form/i18n/en_US.json',
    "{ \"mwErrorMessages\": { \"required\": \"is required\", \"hasToBeValidEmail\": \"has to be a valid e-mail\", \"hasToMatchPattern\": \"has to match the pattern\", \"hasToBeValidUrl\": \"has to be a valid URL\", \"hasToBeValidPhoneNumber\": \"has to be a valid phone number\", \"hasToBeMin\": \"has to be at least {{min}}\", \"hasToBeMinLength\": \"has to have a least {{ngMinlength}} chars\", \"hasToBeSmaller\": \"must not be greater than {{max}}\", \"hasToBeSmallerLength\": \"must not have more chars than {{ngMaxlength}}\" } }"
  );


  $templateCache.put('uikit/mw-inputs/i18n/de_DE.json',
    "{ \"mwSelectBox\": { \"pleaseSelect\": \"Option auswählen\" } }"
  );


  $templateCache.put('uikit/mw-inputs/i18n/en_US.json',
    "{ \"mwSelectBox\": { \"pleaseSelect\": \"Select an option\" } }"
  );


  $templateCache.put('uikit/mw-list/i18n/de_DE.json',
    "{ \"List\": { \"mwListHead\": { \"items\": \"Einträge\", \"selectAll\": \"Alle selektieren\", \"clearSelection\": \"Selektion aufheben\", \"itemSelected\": \"{{name}} ist selektiert\", \"itemsSelected\": \"{{count}} {{name}} sind selektiert\", \"itemAmount\": \"{{count}} {{name}}\", \"searchFor\": \"{{name}} suchen\", \"notAvailable\": \"N/V\", \"notAvailableTooltip\": \"Der Eintrag ist nicht verfügbar. Eventuell wurde dieser gelöscht.\" }, \"mwListFooter\": { \"noneFound\": \"Es wurden keine Einträge gefunden\" } } }"
  );


  $templateCache.put('uikit/mw-list/i18n/en_US.json',
    "{ \"List\": { \"mwListHead\": { \"items\": \"Items\", \"selectAll\": \"Select all\", \"clearSelection\": \"Clear selection\", \"itemSelected\": \"{{name}} is selected\", \"itemsSelected\": \"{{count}} {{name}} are selected\", \"itemAmount\": \"{{count}} {{name}}\", \"searchFor\": \"Search for {{name}}\", \"notAvailable\": \"N/V\", \"notAvailableTooltip\": \"The entry is not available anymore. Maybe is has been deleted.\" }, \"mwListFooter\": { \"noneFound\": \"No entries have been found.\" } } }"
  );


  $templateCache.put('uikit/mw-modal/i18n/de_DE.json',
    "{ \"Modal\": { \"mwModalConfirm\": { \"areYouSure\": \"Sind Sie sich sicher?\" } } }"
  );


  $templateCache.put('uikit/mw-modal/i18n/en_US.json',
    "{ \"Modal\": { \"mwModalConfirm\": { \"areYouSure\": \"Are you sure?\" } } }"
  );


  $templateCache.put('uikit/mw-ui-components/i18n/de_DE.json',
    "{ \"UiComponents\": { \"mwToggle\": { \"on\": \"An\", \"off\": \"Aus\" }, \"mwTimelineFieldset\": { \"entriesHiddenSingular\": \"1 Eintrag ist ausgeblendet\", \"entriesHiddenPlural\": \"{{count}} Einträge sind ausgeblendet\" }, \"mwTextCollapsible\": { \"showMore\": \"mehr anzeigen\", \"showLess\": \"weniger anzeigen\" }, \"mwButtonHelp\": { \"isDisabledBecause\": \"Dieser Button ist deaktiviert weil:\" }, \"mwIndefiniteLoading\": { \"loading\": \"Lade Daten...\" } } }"
  );


  $templateCache.put('uikit/mw-ui-components/i18n/en_US.json',
    "{ \"UiComponents\": { \"mwToggle\": { \"on\": \"On\", \"off\": \"Off\" }, \"mwTimelineFieldset\": { \"entriesHiddenSingular\": \"One entry is hidden\", \"entriesHiddenPlural\": \"{{count}} entries are hidden\" }, \"mwTextCollapsable\": { \"showMore\": \"show more\", \"showLess\": \"show less\" }, \"mwButtonHelp\": { \"isDisabledBecause\": \"This button is currently disabled because:\" }, \"mwIndefiniteLoading\": { \"loading\": \"Loading data...\" } } }"
  );


  $templateCache.put('uikit/mw-utils/i18n/de_DE.json',
    "{ \"Utils\": { \"ok\": \"Ok\", \"cancel\": \"Abbrechen\", \"mwLeaveConfirmationModal\": { \"title\": \"Möchten Sie wirklich die aktuelle Seite verlassen?\", \"continue\": \"Fortfahren\", \"stay\": \"Auf Seite bleiben\" } } }"
  );


  $templateCache.put('uikit/mw-utils/i18n/en_US.json',
    "{ \"Utils\": { \"ok\": \"Ok\", \"cancel\": \"Cancel\" }, \"mwLeaveConfirmationModal\": { \"title\": \"Do you really want to leave the current page?\", \"continue\": \"Continue\", \"stay\": \"Stay on this page\" } }"
  );


  $templateCache.put('uikit/mw_ui_icons.json',
    "{ \"angleLeft\": \"fa-angle-left\", \"angleRight\": \"fa-angle-right\", \"angleUp\": \"fa-angle-up\", \"angleDown\": \"fa-angle-down\", \"caretRight\": \"fa-caret-right\", \"sort\": \"fa-sort\", \"sortAsc\": \"fa-sort-asc\", \"sortDesc\": \"fa-sort-desc\", \"warning\": \"fa-warning\", \"cross\": \"fa-times\", \"chevronUpCircle\": \"fa-chevron-circle-up\", \"chevronDownCircle\": \"fa-chevron-circle-down\", \"question\": \"fa-question\", \"questionCircle\": \"fa-question-circle-o\" }"
  );
}]);

/**
 * Created by zarges on 17/02/16.
 */
angular.module('mwUI.Utils', ['mwUI.i18n','mwUI.Modal']);

window.mwUI.Utils = {};
window.mwUI.Utils.shims = {};

angular.module('mwUI.Utils')
  
  .directive('mwDraggable', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      scope: {
        mwDragData: '=',
        //We can not use camelcase because *-start is a reserved word from angular!
        mwDragstart: '&',
        mwDragend: '&',
        mwDropEffect: '@'
      },
      link: function (scope, el) {

        el.attr('draggable', true);
        el.addClass('draggable', true);

        if (scope.mwDragstart) {
          el.on('dragstart', function (event) {
            event.originalEvent.dataTransfer.setData('text', JSON.stringify(scope.mwDragData));
            event.originalEvent.dataTransfer.effectAllowed = scope.mwDropEffect;
            $timeout(function () {
              scope.mwDragstart({event: event, dragData: scope.mwDragData});
            });
          });
        }


        el.on('dragend', function (event) {
          if (scope.mwDragend) {
            $timeout(function () {
              scope.mwDragend({event: event});
            });
          }
        });
      }
    };
  }]);
angular.module('mwUI.Utils')

  .directive('mwDroppable', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      scope: {
        mwDropData: '=',
        mwDragenter: '&',
        mwDragleave: '&',
        mwDragover: '&',
        mwDrop: '&',
        disableDrop: '='
      },
      link: function (scope, el) {

        el.addClass('droppable');

        var getDragData = function (event) {
          var text = event.originalEvent.dataTransfer.getData('text');
          if (text) {
            return JSON.parse(text);
          }
        };

        if (scope.mwDragenter) {
          el.on('dragenter', function (event) {
            if (scope.disableDrop !== true) {
              el.addClass('drag-over');
            }
            $timeout(function () {
              scope.mwDragenter({event: event});
            });
          });
        }

        if (scope.mwDragleave) {
          el.on('dragleave', function (event) {
            el.removeClass('drag-over');
            $timeout(function () {
              scope.mwDragleave({event: event});
            });
          });
        }

        if (scope.mwDrop) {
          el.on('drop', function (event) {
            el.removeClass('drag-over');
            if (event.stopPropagation) {
              event.stopPropagation(); // stops the browser executing other event listeners which are maybe deined in parent elements.
            }
            var data = getDragData(event);
            $timeout(function () {
              scope.mwDrop({
                event: event,
                dragData: data,
                dropData: scope.mwDropData
              });
            });
            return false;
          });
        }

        // Necessary. Allows us to drop.
        var handleDragOver = function (ev) {
          if (scope.disableDrop !== true) {
            if (ev.preventDefault) {
              ev.preventDefault();
            }
            return false;
          }
        };
        el.on('dragover', handleDragOver);

        if (scope.mwDragover) {
          el.on('dragover', function (event) {
            $timeout(function () {
              scope.mwDragover({event: event});
            });
          });
        }

        scope.$on('$destroy', function () {
          el.off();
        });
      }
    };
  }]);
angular.module('mwUI.Utils')

  .directive('mwInfiniteScroll', ['$window', function ($window) {
    return {
      restrict: 'A',
      link: function (scope, el, attrs) {

        var collection,
          loading = false,
          throttledScrollFn,
          scrollContainerEl,
          scrollContentEl,
          loadedPages = 0;

        if (attrs.mwListCollection) {
          collection = scope.$eval(attrs.mwListCollection).getCollection();
        } else if (attrs.collection) {
          collection = scope.$eval(attrs.collection);
        } else {
          console.warn('No collection was found for the infinite scroll pleas pass it as scope attribute');
        }

        if (!collection || (collection && !collection.filterable)) {
          return;
        }

        var loadNextPage = function () {
          if (!loading && collection.filterable.hasNextPage()) {
            loading = true;
            loadedPages++;
            return collection.filterable.loadNextPage().then(function () {
              loading = false;
            });
          }
        };

        // The threshold is controlled by how many pages are loaded
        // The first pagination request should be done quite early so the user does not recognize that something
        // is loaded.
        // As scrollbar is getting longer and longer the threshold has to be also increased.
        // Threshold starts at 40% and is increased by 10% until the max threshold of 90% is reached
        var getLoadThreshold = function(){
          var minThreshold = 4,
              maxThreshold = 9;

          return Math.min(minThreshold+loadedPages,maxThreshold)/10;
        };

        var scrollFn = function () {
          var contentHeight = scrollContentEl[0].clientHeight || scrollContentEl.height(),
              totalHeight = contentHeight - scrollContainerEl.height(),
              threshold = getLoadThreshold();

          if ( scrollContainerEl.scrollTop() / totalHeight > threshold) {
            loadNextPage();
          }
        };

        if(attrs.scrollContainerSelector || attrs.scrollContentSelector){
          // Custom element defined by selectors. The scrollContainer is the element that has the scrollbar
          // The scrollContent is the element inside the scroll container that should be scrolled
          // At least one of them has to be defined and if you define both they must not be the same
          if(attrs.scrollContainerSelector && el.parents(attrs.scrollContainerSelector).length > 0){
            scrollContainerEl = el.parents(attrs.scrollContainerSelector).first();
          } else if(attrs.scrollContainerSelector && el.parents(attrs.scrollContainerSelector).length===0){
            throw new Error ('No parent of the infinite scroll element with the selector '+attrs.scrollContainerSelector+' could be found!');
          } else {
            scrollContainerEl = el;
          }

          if(attrs.scrollContentSelector && el.find(attrs.scrollContentSelector).length > 0){
            scrollContentEl = el.find(attrs.scrollContentSelector).first();
          } else if(attrs.scrollContentSelector && el.find(attrs.scrollContentSelector).length === 0){
            throw new Error ('No child of the infinite scroll element with the selector '+attrs.scrollContentSelector+' could be found!');
          } else {
            scrollContentEl = el;
          }
        } else if (el.parents('.modal').length) {
          //element in modal
          scrollContainerEl = el.parents('*[mw-modal-body]');
          scrollContentEl = el.parents('.modal-body');
        } else {
          //element in window
          scrollContainerEl = angular.element($window);
          scrollContentEl = angular.element(document);
        }

        if(scrollContainerEl === scrollContentEl){
          throw new Error('The scrollContainerElement can not be the same as the actual scrollContentElement');
        }

        throttledScrollFn = _.throttle(scrollFn, 500);

        // Register scroll callback
        scrollContainerEl.on('scroll', throttledScrollFn);

        // Deregister scroll callback if scope is destroyed
        scope.$on('$destroy', function () {
          scrollContainerEl.off('scroll', throttledScrollFn);
        });
      }
    };
  }]);
angular.module('mwUI.Utils')

  .directive('mwLeaveConfirmation', ['$window', '$rootScope', 'LeaveConfirmationModal', function ($window, $rootScope, LeaveConfirmationModal) {
    return {
      scope: {
        alertBeforeLeave: '=mwLeaveConfirmation',
        text: '@'
      },
      link: function (scope) {

        var confirmationModal = new LeaveConfirmationModal();

        // Prevent the original event so the routing will not be completed
        // Save the url where it should be navigated to in a temp variable
        var showConfirmModal = function (nextUrl) {
          confirmationModal.setScopeAttributes({
            nextUrl: nextUrl,
            text: scope.text,
            leaveCallback: function () {
              scope.changeLocationOff();
            },
            stayCallback: function () {

            }
          });
          confirmationModal.show();
        };

        //In case that just a hashchange event was triggered
        scope.changeLocationOff = $rootScope.$on('$locationChangeStart', function (ev, nextUrl) {
          if (scope.alertBeforeLeave) {
            ev.preventDefault();
            showConfirmModal(nextUrl);
          }
        });

        //In case that the user clicks the refresh/back button or makes a hard url change
        $window.onbeforeunload = function () {
          if (scope.alertBeforeLeave) {
            return scope.text;
          }
        };

        if (!angular.isDefined(scope.text)) {
          throw new Error('Please specify a text in the text attribute');
        }

        scope.$on('$destroy', scope.changeLocationOff);
      }
    };
  }]);

angular.module('mwUI.Utils')

  .directive('mwPreventDefault', function () {
    return {
      restrict: 'A',
      link: function (scope, elm, attr) {
        if (!attr.mwPreventDefault) {
          throw new Error('Directive mwPreventDefault: This directive must have an event name as attribute e.g. mw-prevent-default="click"');
        }
        elm.on(attr.mwPreventDefault, function (event) {
          event.preventDefault();
        });
      }
    };
  });
angular.module('mwUI.Utils')

  .directive('mwStopPropagation', function () {
    return {
      restrict: 'A',
      link: function (scope, elm, attr) {
        if (!attr.mwStopPropagation) {
          throw new Error('Directive mwStopPropagation: This directive must have an event name as attribute e.g. mw-stop-propagation="keyup"');
        }
        elm.on(attr.mwStopPropagation, function (event) {
          event.stopPropagation();
        });
      }
    };
  });

angular.module('mwUI.Utils')

  .filter('reduceStringTo', function () {
    return function (input, count) {
      if(count && input && input.length > count) {
        return input.substr(0, count) + '...';
      }
      return input;
    };
  });

angular.module('mwUI.Utils')

  .factory('LeaveConfirmationModal', ['Modal', function (Modal) {
    return Modal.prepare({
      templateUrl: 'uikit/mw-utils/modals/templates/mw_leave_confirmation_modal.html',
      controller: 'LeaveConfirmationModalController'
    });
  }])

  .controller('LeaveConfirmationModalController', ['$scope', function ($scope) {
    $scope.stay = function () {
      $scope.stayCallback();
      $scope.hideModal();
    };

    // User really wants to navigate to that page which was saved before in a temp variable
    $scope.continue = function () {
      if ($scope.nextUrl) {
        //hide the modal and navigate to the page
        $scope.leaveCallback();
        $scope.hideModal().then(function () {
          document.location.href=$scope.nextUrl;
        });
      } else {
        throw new Error('NextUrl has to be set!');
      }
    };
  }]);

angular.module('mwUI.Utils')

  .service('callbackHandler', ['$injector', function($injector){
    return {
      execFn: function(cb, params, scope){
        if(params && angular.isArray(params)){
          return cb.apply(scope, params);
        } else {
          return cb.call(scope, params);
        }
      },
      getFn: function(cb){
        if(angular.isString(cb)){
          return $injector.get(cb);
        } else if(angular.isFunction(cb)){
          return cb;
        } else {
          throw new Error('First argument has to be either a valid service or function');
        }
      },
      exec: function(cb, params, scope){
        return this.execFn(this.getFn(cb), params, scope);
      }
    };
  }]);

/**
 * Created by zarges on 17/02/16.
 */
window.mwUI.Utils.shims.concatUrlParts = function(){
  var concatUrl = '';
  _.forEach(arguments,function(url){
    url = url.replace(/^\//,'');
    url = url.replace(/\/$/,'');
    concatUrl += ( url +('/') );
  });
  return concatUrl;
};
'use strict';
window.mwUI.Utils.shims.domObserver = function (el, callback, config) {

  var observer = new MutationObserver(function (mutations) {
      callback.call(this, mutations);
    }),
    node = (el instanceof angular.element) ? el[0] : el;

  config = config || {
      attributes: true,
      childList: true, characterData: true
    };

  observer.observe(node, config);

  return observer;
};
/**
 * Created by zarges on 17/02/16.
 */
window.mwUI.Utils.shims.routeToRegExp = function(route){
  var  optionalParam = /\((.*?)\)/g,
    namedParam = /(\(\?)?:\w+/g,
    splatParam = /\*\w?/g,
    escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  if(!_.isString(route)){
    throw new Error('The route ' + JSON.stringify(route) + 'has to be a URL');
  }

  route = route.replace(escapeRegExp, '\\$&')
    .replace(optionalParam, '(?:$1)?')
    .replace(namedParam, function (match, optional) {
      return optional ? match : '([^/?]+)';
    })
    .replace(splatParam, '([^?]*?)');
  return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
};

angular.module('mwUI.Utils').config(['i18nProvider', function(i18nProvider){
  i18nProvider.addResource('uikit/mw-utils/i18n');
}]);

/**
 * Created by zarges on 15/02/16.
 */
window.mwUI.Backbone = {
  baseUrl: '',
  Selectable: {},
  use$http: true
};

angular.module('mwUI.Backbone', []);

mwUI.Backbone.NestedModel = Backbone.NestedModel = Backbone.Model.extend({

  nested: function () {
    return {};
  },

  _prepare: function () {
    var nestedAttributes = this.nested(),
      instanceObject = {};
    for (var key in nestedAttributes) {
      if (typeof nestedAttributes[key] === 'function') {
        var instance = new nestedAttributes[key]();

        instance.parent = this;
        instanceObject[key] = instance;
      } else {
        throw new Error('Nested attribute ' + key + ' is not a valid constructor. Do not set an instance as nested attribute.');
      }
    }

    return instanceObject;
  },

  _setNestedModel: function (key, value) {
    if (_.isObject(value)) {
      this.get(key).set(value);
    } else {
      var id = this.get(key).idAttribute;
      this.get(key).set(id, value);
    }
  },

  _setNestedCollection: function (key, value) {
    if (_.isObject(value) && !_.isArray(value)) {
      this.get(key).add(value);
    } else if (_.isArray(value)) {
      value.forEach(function (val) {
        this._setNestedCollection(key, val);
      }.bind(this));
    } else {
      var id = this.get(key).model.prototype.idAttribute,
        obj = {};

      obj[id] = value;
      this.get(key).add(obj);
    }
  },

  _setNestedAttributes: function (obj) {

    for (var key in obj) {
      var nestedAttrs = this.nested(),
        value = obj[key],
        nestedValue = nestedAttrs[key];

      if (nestedValue && !(value instanceof nestedValue) && this.get(key)) {

        if (this.get(key) instanceof Backbone.Model) {
          this._setNestedModel(key, value);
        } else if (this.get(key) instanceof Backbone.Collection) {
          this._setNestedCollection(key, value);
        }

        delete obj[key];
      }
    }

    return obj;
  },

  _nestedModelToJson: function (model) {
    var result;

    if (model instanceof Backbone.NestedModel) {
      result = model._prepareDataForServer();
    } else {
      result = model.toJSON();
    }

    return result;
  },

  _prepareDataForServer: function () {
    var attrs = _.extend({}, this.attributes),
      nestedAttrs = this.nested();

    for (var key in nestedAttrs) {
      var nestedAttr = this.get(key);

      if (nestedAttr instanceof Backbone.Model) {
        attrs[key] = this._nestedModelToJson(nestedAttr);
      } else if (nestedAttr instanceof Backbone.Collection) {
        var result = [];

        nestedAttr.each(function (model) {
          result.push(this._nestedModelToJson(model));
        }.bind(this));

        attrs[key] = result;
      }
    }

    return this.compose(attrs);
  },

  constructor: function (attributes, options) {
    options = options || {};
    if (options.parse) {
      attributes = this.parse(attributes);
      options.parse = false;
    }
    this.attributes = this._prepare();
    this.set(attributes);
    attributes = this.attributes;
    return Backbone.Model.prototype.constructor.call(this, attributes, options);
  },

  set: function (attributes, options) {
    var obj = {};

    if (_.isString(attributes)) {
      obj[attributes] = options;
    } else if (_.isObject(attributes)) {
      obj = attributes;
    }

    if(!_.isObject(options)){
      options = null;
    }

    obj = this._setNestedAttributes(obj);

    return Backbone.Model.prototype.set.call(this, obj, options);
  },

  compose: function (attrs) {
    return attrs;
  },

  toJSON: function (options) {
    // When options are set toJSON is called from the sync method so it is called before the object is send to the server
    // We use this to transform our data before we are sending it to the server
    // It is the counterpart of parse for the server
    if (options) {
      return this._prepareDataForServer();
    } else {
      return Backbone.Model.prototype.toJSON.apply(this, arguments);
    }
  },

  clear: function (options) {
    var attrs = {};

    for (var key in this.attributes){
      if(this.get(key) instanceof Backbone.Model){
        this.get(key).clear();
      } else if(this.get(key) instanceof Backbone.Collection){
        this.get(key).reset();
      } else {
        attrs[key] = void 0;
      }
    }

    return this.set(attrs, _.extend({}, options, {unset: true}));
  }
});


/*jshint unused:false */
mwUI.Backbone.Selectable.Model = function (modelInstance, options) {

  var _model = modelInstance,
      _selected = options.selected || false;

  this.isInCollection = false;

  this.hasDisabledFn = (typeof options.isDisabled === 'function') || false;

  this.isDisabled = function () {
    if (this.hasDisabledFn) {
      return options.isDisabled.apply(modelInstance, arguments);
    }
    return false;
  };

  this.isSelected = function () {
    return _selected;
  };

  this.select = function (options) {
    options = options || {};
    if ( (!this.isDisabled() || options.force) && !this.isSelected()) {
      _selected = true;
      if(!options.silent){
        this.trigger('change change:select',modelInstance,this);
      }
    }
  };

  this.unSelect = function (options) {
    options = options || {};
    if(this.isSelected()){
      _selected = false;
      if(!options.silent){
        this.trigger('change change:unselect',modelInstance,this);
      }
    }
  };

  this.toggleSelect = function () {
    if (this.isSelected()) {
      this.unSelect();
    } else {
      this.select();
    }
  };

  var main = function(){
    if (!(_model instanceof Backbone.Model)) {
      throw new Error('First parameter has to be the instance of a model');
    }
  };

  main.call(this);
};

_.extend(mwUI.Backbone.Selectable.Model.prototype, Backbone.Events);
mwUI.Backbone.SelectableModel = Backbone.SelectableModel = Backbone.Model.extend({
  selectable: true,
  selectableOptions: function(){
    return {
      selected: false,
      isDisabled: null
    };
  },
  selectableModelConstructor: function(options){
    if (this.selectable) {
      this.selectable = new mwUI.Backbone.Selectable.Model(this, this.selectableOptions.call(this, options));
    }
    this.on('destroy', function(){
      //Decrement counter of parent collection when model is destroyed
      if (this.collection && this.collection.filterable && this.collection.filterable.getTotalAmount() > 0) {
        this.collection.filterable.setTotalAmount(this.collection.filterable.getTotalAmount() - 1);
      }
    });
  },
  constructor: function (attributes, options) {
    var superConstructor = Backbone.Model.prototype.constructor.call(this, attributes, options);
    this.selectableModelConstructor(options);
    return superConstructor;
  }

});
mwUI.Backbone.Model = mwUI.Backbone.NestedModel.extend({
  selectable: true,
  basePath: '',
  endpoint: null,
  selectableOptions: mwUI.Backbone.SelectableModel.prototype.selectableOptions,
  urlRoot: function () {
    var basePath = _.result(this, 'basePath'),
      endpoint = _.result(this, 'endpoint');

    if (endpoint) {
      return window.mwUI.Utils.shims.concatUrlParts(mwUI.Backbone.baseUrl,basePath,endpoint);
    } else {
      throw new Error('An endpoint has to be specified');
    }
  },
  constructor: function () {
    var superConstructor = mwUI.Backbone.NestedModel.prototype.constructor.apply(this, arguments);
    mwUI.Backbone.SelectableModel.prototype.selectableModelConstructor.apply(this, arguments);
    return superConstructor;
  },
  getEndpoint: function () {
    return this.urlRoot();
  },
  setEndpoint: function (endpoint) {
    this.endpoint = endpoint;
  },
  sync: function (method, model, options) {
    options.instance = this;
    return mwUI.Backbone.NestedModel.prototype.sync.call(this, method, model, options);
  },
  request: function (url, method, options) {
    options = options || {};
    var requestOptions = {
      url: url,
      type: method,
      instance: this
    };
    return Backbone.ajax(_.extend(requestOptions, options));
  }
});


mwUI.Backbone.Filter = function () {
  // If it is an invalid value return null otherwise the provided object
  var returnNullOrObjectFor = function (value, object) {
    return (_.isUndefined(value) || value === null || value === '' || value.length===0 || (_.isArray(value) && _.compact(value).length===0)) ? null : object;
  };

  return {
    containsString: function (fieldName, value) {
      return returnNullOrObjectFor(value, {
        type: 'containsString',
        fieldName: fieldName,
        contains: value
      });
    },

    string: function (fieldName, value) {
      return returnNullOrObjectFor(value, {
        type: 'string',
        fieldName: fieldName,
        value: value
      });
    },

    and: function (filters) {
      return this.logOp(filters, 'AND');
    },

    nand: function (filters) {
      return this.logOp(filters, 'NAND');
    },

    or: function (filters) {
      return this.logOp(filters, 'OR');
    },

    logOp: function (filters, operator) {
      filters = _.without(filters, null); // Removing null values from existing filters

      return filters.length === 0 ? null : { // Ignore logOps with empty filters
        type: 'logOp',
        operation: operator,
        filters: filters
      };
    },

    boolean: function (fieldName, value) {
      return returnNullOrObjectFor(value, {
        type: 'boolean',
        fieldName: fieldName,
        value: value
      });
    },

    stringMap: function (fieldName, key, value) {
      if(value === '%%'){
        value = '';
      }
      return returnNullOrObjectFor(value, {
        type: 'stringMap',
        fieldName: fieldName,
        value: value,
        key: key
      });
    },

    stringEnum: function (fieldName, values) {
      return returnNullOrObjectFor(values, {
        type: 'stringEnum',
        fieldName: fieldName,
        values: _.flatten(values)
      });
    },

    long: function (fieldName, value) {
      return returnNullOrObjectFor(value, {
        type: 'long',
        fieldName: fieldName,
        value: value
      });
    },

    like: function (fieldName, value) {
      return returnNullOrObjectFor(value, {
        type: 'like',
        fieldName: fieldName,
        like: value
      });
    },

    notNull: function (fieldName) {
      return returnNullOrObjectFor(true, {
        type: 'null',
        fieldName: fieldName
      });
    },

    dateRange: function(fieldName, min, max){
      return returnNullOrObjectFor(max, returnNullOrObjectFor(min, {
        type: 'dateRange',
        fieldName: fieldName,
        min: min,
        max: max
      }));
    }
  };

};

/*jshint unused:false */
mwUI.Backbone.Filterable = function (collectionInstance, options) {

  options = options || {};

  var _collection = collectionInstance,
    _limit = options.limit,
    _offset = _limit ? options.offset : false,
    _page = options.page || 1,
    _perPage = options.perPage || 30,
    _initialFilterValues = options.filterValues ? JSON.parse(JSON.stringify(options.filterValues)) : options.filterValues,
    _initialCustomUrlParams = _.clone(options.customUrlParams),
    _filterDefinition = options.filterDefinition,
    _sortOrder = options.sortOrder,
    _totalAmount,
    _lastFilter;

  this.filterValues = options.filterValues || {};
  this.customUrlParams = options.customUrlParams || {};
  this.fields = options.fields;
  this.filterIsSet = false;

  this.hasFilterChanged = function(filter){
    return JSON.stringify(filter) !== JSON.stringify(_lastFilter);
  };

  this.getRequestParams = function (options) {
    options.params = options.params || {};

    // Filter functionality
    var filter = this.getFilters();
    if (filter) {
      options.params.filter = filter;
    }

    //reset pagination if filter values change
    if (this.hasFilterChanged(filter)) {
      _page = 1;
    }

    // Pagination functionality
    if (_perPage && _page && (_limit || _.isUndefined(_limit))) {
      options.params.limit = _perPage;

      // Calculate offset
      options.params.offset = _page > 1 ? _perPage * (_page - 1) : 0;
    }

    // Sort order
    if (_sortOrder && _sortOrder.length > 0) {
      options.params.sortOrder = _sortOrder;
    }

    // Fallback to limit and offset if they're set manually, overwrites pagination settings
    if (_limit || _offset) {
      options.params.limit = _limit;
      options.params.offset = _offset;
    }

    if (_limit === false) {
      delete options.params.limit;
    }

    if (this.fields && this.fields.length > 0) {
      options.params.field = this.fields;
    }

    // Custom URL parameters
    if (this.customUrlParams) {
      _.extend(options.params, _.result(this, 'customUrlParams'));
    }

    //always set non paged parameter
    options.params.getNonpagedCount = true;

    _lastFilter = filter;

    return options.params;
  };

  this.setLimit = function (limit) {
    _limit = limit;
    _offset = _offset || 0;
  };

  this.setTotalAmount = function (totalAmount) {
    _totalAmount = totalAmount;
  };

  this.getTotalAmount = function () {
    return _totalAmount;
  };

  this.loadPreviousPage = function () {
    _page -= 1;
    return _collection.fetch({remove: false});
  };

  this.hasPreviousPage = function () {
    return _page >= 1;
  };

  this.loadNextPage = function () {
    _page += 1;
    return _collection.fetch({remove: false});
  };

  this.hasNextPage = function () {
    return _totalAmount && _totalAmount > _collection.length;
  };

  this.getPage = function () {
    return _page;
  };

  this.getTotalPages = function () {
    return Math.floor(_totalAmount / _perPage);
  };

  this.setSortOrder = function (sortOrder) {
    _page = 1;
    _sortOrder = sortOrder;
  };

  this.getSortOrder = function () {
    return _sortOrder;
  };

  this.setFilters = function (filterMap) {

    _.forEach(filterMap, function (value, key) {
      if (_.has(this.filterValues, key)) {
        this.filterValues[key] = value;
      } else {
        throw new Error('Filter named \'' + key + '\' not found, did you add it to filterValues of the model?');
      }
    }, this);

    this.filterIsSet = true;

  };

  this.getFilters = function () {
    if (_.isFunction(_filterDefinition)) {
      return _filterDefinition.apply(this);
    }
  };

  this.resetFilters = function () {
    this.filterValues = _initialFilterValues ? JSON.parse(JSON.stringify(_initialFilterValues)) : _initialFilterValues;
    this.customUrlParams = _initialCustomUrlParams;
    this.filterIsSet = false;
  };

  (function _main() {
    if (!(_collection instanceof Backbone.Collection)) {
      throw new Error('First parameter has to be the instance of a collection');
    }

  }());
};
mwUI.Backbone.FilterableCollection = Backbone.FilterableCollection = Backbone.Collection.extend({
  selectable: true,
  filterableOptions: function () {
    return {
      limit: undefined,
      offset: false,
      page: 1,
      perPage: 30,
      filterValues: {},
      customUrlParams: {},
      filterDefinition: function () {},
      fields: [],
      sortOrder: ''
    };
  },
  filterableCollectionConstructor: function (options) {
    if (this.filterable) {
      this.filterable = new mwUI.Backbone.Filterable(this, this.filterableOptions.call(this, options));
    }
  },
  constructor: function (attributes, options) {
    var superConstructor = Backbone.Model.prototype.constructor.call(this, attributes, options);
    this.filterableCollectionConstructor(options);
    return superConstructor;
  },
  fetch: function (options) {
    options = options || {};
    options.params = options.params || {};

    if (this.filterable) {
      var filterableParams = this.filterable.getRequestParams(options);
      _.extend(options.params, filterableParams);
    }

    return Backbone.Collection.prototype.fetch.call(this, options);
  }
});
mwUI.Backbone.Selectable.Collection = function (collectionInstance, options) {
  var _collection = collectionInstance,
    _options = options || {},
    _modelHasDisabledFn = true,
    _isSingleSelection = _options.isSingleSelection || false,
    _addPreSelectedToCollection = _options.addPreSelectedToCollection || false,
    _unSelectOnRemove = _options.unSelectOnRemove,
    _preSelected = options.preSelected,
    _selected = new Backbone.Collection();

  var _preselect = function () {
    if (_preSelected instanceof Backbone.Model) {
      _isSingleSelection = true;
      this.preSelectModel(_preSelected);
    } else if (_preSelected instanceof Backbone.Collection) {
      _isSingleSelection = false;
      this.preSelectCollection(_preSelected);
    } else {
      throw new Error('The option preSelected has to be either a Backbone Model or Collection');
    }
  };

  var _bindModelOnSelectListener = function(model){
    this.listenTo(model.selectable, 'change:select', function(){
      if(!_selected.get(model)){
        this.select(model);
      }
    }.bind(this));
  };

  var _bindModelOnUnSelectListener = function(model){
    this.listenTo(model.selectable, 'change:unselect', function(){
      if(_selected.get(model)) {
        this.unSelect(model);
      }
    }.bind(this));
  };

  var _setModelSelectableOptions = function (model, options) {
    if(model && model.selectable){
      var selectedModel = _selected.get(model);

      if (selectedModel) {
        if (_collection.get(model)) {
          model.selectable.isInCollection = true;
          selectedModel.selectable.isInCollection = true;
        } else {
          model.selectable.isInCollection = false;
          selectedModel.selectable.isInCollection = false;
        }
        model.selectable.select(options);
        selectedModel.selectable.select(options);
      } else {
        model.selectable.unSelect(options);
      }

      _bindModelOnSelectListener.call(this,model);
      _bindModelOnUnSelectListener.call(this,model);
    }
  };

  var _updatePreSelectedModel = function(preSelectedModel, model){
    if(_preSelected){
      if(this.isSingleSelection()){
        _preSelected = model;
      } else {
        _preSelected.remove(preSelectedModel, {silent: true});
        _preSelected.add(model, {silent: true});
      }
    }
  };

  var _updateSelectedModel = function(model){
    var selectedModel = this.getSelected().get(model);
    if(selectedModel){
      _selected.remove(selectedModel, {silent: true});
      _selected.add(model, {silent: true});
      _updatePreSelectedModel.call(this,selectedModel, model);
      _setModelSelectableOptions.call(this,model,{silent: true});
    }
  };

  this.getSelected = function () {
    return _selected;
  };

  this.getDisabled = function () {
    var disabled = new Backbone.Collection();
    if(_modelHasDisabledFn){
      _collection.each(function (model) {
        if (model.selectable && model.selectable.isDisabled()) {
          disabled.add(model);
        }
      });
    }

    return disabled;
  };

  /**
   *
   * @param model
   */
  this.select = function (model, options) {
    options = options || {};
    if (model instanceof Backbone.Model) {
      if (!(model instanceof _collection.model)) {
        model = new _collection.model(model.toJSON());
      }

      if (!model.selectable || (model.selectable.isDisabled() && !options.force)) {
        return;
      }

      if (_isSingleSelection) {
        this.unSelectAll();
      }

      model.on('change', function(model, opts){
        opts = opts || {};
        if(opts.unset || !model.id || model.id.length<1){
          this.unSelect(model);
        }
      }, this);

      _selected.add(model);
      _setModelSelectableOptions.call(this, model, options);
      this.trigger('change change:add', model, this);
    } else {
      throw new Error('The first argument has to be a Backbone Model');
    }
  };

  this.selectAll = function () {
    _collection.each(function (model) {
      this.select(model);
    }, this);
  };

  this.unSelect = function (model, options) {
    options = options || {};
    _selected.remove(model);
    _setModelSelectableOptions.call(this, model, options);
    this.trigger('change change:remove', model, this);
  };

  this.unSelectAll = function () {
    var selection = this.getSelected().clone();
    selection.each(function (model) {
      this.unSelect(model);
    },this);
  };

  this.toggleSelectAll = function () {
    if (this.allSelected()) {
      this.unSelectAll();
    } else {
      this.selectAll();
    }
  };

  this.allSelected = function () {
    var disabledModelsAmount = this.getDisabled().length;

    return this.getSelected().length === _collection.length - disabledModelsAmount;
  };

  this.allDisabled = function () {
    return this.getDisabled().length === _collection.length;
  };

  this.isSingleSelection = function () {
    return _isSingleSelection;
  };

  this.reset = function () {
    this.unSelectAll();
    _preselect.call(this);
  };

  this.preSelectModel = function (model) {
    if (model.id) {

      if (!_collection.get(model) && _addPreSelectedToCollection) {
        _collection.add(model);
      }

      this.select(model, {force: true, silent: true});
    }
  };

  this.preSelectCollection = function (collection) {
    collection.each(function (model) {
      this.preSelectModel(model);
    }, this);

    collection.on('add', function (model) {
      this.preSelectModel(model);
    }, this);

    collection.on('remove', function (model) {
      this.unSelect(model);
    }, this);

  };


  var main = function(){
    if(!(_collection instanceof Backbone.Collection)){
      throw new Error('The first parameter has to be from type Backbone.Collection');
    }

    _collection.on('add', function (model) {
      _modelHasDisabledFn = model.selectable.hasDisabledFn;
      _setModelSelectableOptions.call(this,model);
      _updateSelectedModel.call(this,model);
    }, this);

    _collection.on('remove', function (model) {
      if (_unSelectOnRemove) {
        this.unSelect(model);
      } else {
        _setModelSelectableOptions.call(this,model);
      }
    }, this);

    _collection.on('reset', function () {
      if (_unSelectOnRemove) {
        this.unSelectAll();
      } else {
        this.getSelected().each(function(model){
          _setModelSelectableOptions.call(this,model);
        }, this);
      }
    }, this);

    if (_preSelected) {
      _preselect.call(this);
    }
  };

  main.call(this);

};

_.extend(mwUI.Backbone.Selectable.Collection.prototype, Backbone.Events);
mwUI.Backbone.SelectableCollection = Backbone.SelectableCollection = Backbone.Collection.extend({
  selectable: true,
  selectableOptions: function(){
    return {
      isSingleSelection: false,
      addPreSelectedToCollection: false,
      unSelectOnRemove: false,
      preSelected: new Backbone.Collection()
    };
  },
  selectableCollectionConstructor: function(options){
    if (this.selectable) {
      this.selectable = new mwUI.Backbone.Selectable.Collection(this, this.selectableOptions.call(this,options));
    }
  },
  constructor: function (attributes, options) {
    var superConstructor = Backbone.Collection.prototype.constructor.call(this, attributes, options);
    this.selectableCollectionConstructor(options);
    return superConstructor;
  }
});
mwUI.Backbone.Collection = Backbone.Collection.extend({
  selectable: true,
  filterable: true,
  basePath: '',
  endpoint: null,
  selectableOptions: mwUI.Backbone.SelectableCollection.prototype.selectableOptions,
  filterableOptions: mwUI.Backbone.FilterableCollection.prototype.filterableOptions,
  model: mwUI.Backbone.Model,
  url: function () {
    var basePath = _.result(this, 'basePath'),
      endpoint = _.result(this, 'endpoint');

    if (endpoint) {
      return mwUI.Utils.shims.concatUrlParts(mwUI.Backbone.baseUrl, basePath, endpoint);
    } else {
      throw new Error('An endpoint has to be specified');
    }
  },
  getEndpoint: function () {
    return this.url();
  },
  setEndpoint: function (endpoint) {
    this.endpoint = endpoint;
  },
  replace: function (models) {
    this.reset(models);
    this.trigger('replace', this);
  },
  constructor: function () {
    var superConstructor = Backbone.Collection.prototype.constructor.apply(this, arguments);
    mwUI.Backbone.SelectableCollection.prototype.selectableCollectionConstructor.apply(this, arguments);
    mwUI.Backbone.FilterableCollection.prototype.filterableCollectionConstructor.apply(this, arguments);
    return superConstructor;
  },
  fetch: function () {
    return mwUI.Backbone.FilterableCollection.prototype.fetch.apply(this, arguments);
  }
});

angular.module('mwUI.Backbone')

  .directive('mwCollection', function () {
    return {
      require: '?ngModel',
      link: function (scope, el, attrs, ngModel) {
        var collection;

        var updateNgModel = function () {
          if(collection.length>0){
            ngModel.$setViewValue(collection);
            ngModel.$render();
          } else {
            ngModel.$setViewValue(null);
            ngModel.$render();
          }
        };


        var init = function () {
          collection = scope.$eval(attrs.mwCollection);

          if (collection) {
            updateNgModel();
            collection.on('add remove reset', updateNgModel);
          }
        };

        if (ngModel) {
          if (scope.mwModel) {
            init();
          } else {
            var off = scope.$watch('mwCollection', function () {
              off();
              init();
            });
          }
        }
      }
    };
  });
angular.module('mwUI.Backbone')

  .directive('mwModel', function () {
    return {
      require: '?ngModel',
      link: function (scope, el, attrs, ngModelCtrl) {
        var model, modelAttr;

        var updateNgModel = function () {
          var val = model.get(modelAttr);

          ngModelCtrl.$formatters.forEach(function (formatFn) {
            val = formatFn(val);
          });

          ngModelCtrl.$setViewValue(val);
          ngModelCtrl.$render();
        };

        var updateBackboneModel = function () {
          var obj = {};

          obj[modelAttr] = ngModelCtrl.$modelValue;
          model.set(obj, {fromNgModel: true});
        };

        var getModelAttrName = function () {
          var mwModelAttrOption = attrs.mwModelAttr,
            mwModelAttrFromNgModel = attrs.ngModel;

          if (mwModelAttrOption && mwModelAttrOption.length > 0) {
            return mwModelAttrOption;
          } else if (angular.isUndefined(mwModelAttrOption) && mwModelAttrFromNgModel) {
            return mwModelAttrFromNgModel.split('.').pop();
          }
        };

        var init = function () {
          model = scope.$eval(attrs.mwModel);
          modelAttr = getModelAttrName();

          if (ngModelCtrl && model && modelAttr) {

            model.on('change:' + modelAttr, function (model, val, options) {
              if (!options.fromNgModel) {
                updateNgModel();
              }
            });

            ngModelCtrl.$viewChangeListeners.push(updateBackboneModel);
            ngModelCtrl.$parsers.push(function (val) {
              updateBackboneModel();
              return val;
            });

            if (model.get(modelAttr) && ngModelCtrl.$modelValue && model.get(modelAttr) !== ngModelCtrl.$modelValue) {
              throw new Error('The ng-model and the backbone model can not have different values during initialization!');
            } else if (model.get(modelAttr)) {
              updateNgModel();
            } else if (ngModelCtrl.$modelValue) {
              updateBackboneModel();
            }
          }
        };

        if (scope.mwModel && getModelAttrName()) {
          init();
        } else {
          var offModel = scope.$watch('mwModel', function () {
            offModel();
            init();
          });

          var offModelAttr = scope.$watch('mwModelAttr', function () {
            offModelAttr();
            init();
          });
        }
      }
    };
  });

var _backboneAjax = Backbone.ajax,
  _backboneSync = Backbone.sync,
  _$http,
  _$q;

angular.module('mwUI.Backbone')

  .run(['$http', '$q', function ($http, $q) {
    _$http = $http;
    _$q = $q;
  }]);

Backbone.ajax = function (options) {
  if (mwUI.Backbone.use$http && _$http) {
    // Set HTTP Verb as 'method'
    options.method = options.type;
    // Use angulars $http implementation for requests
    return _$http.apply(angular, arguments).then(function(resp){
      if (options.success && typeof options.success === 'function') {
        options.success(resp);
      }
      return resp;
    }, function(resp){
      if (options.error && typeof options.error === 'function') {
        options.error(resp);
      }
      return _$q.reject(resp);
    });
  } else {
    return _backboneAjax.apply(this, arguments);
  }
};

Backbone.sync = function (method, model, options) {
  // we have to set the flag to wait true otherwise all cases were you want to delete mutliple entries will break
  // https://github.com/jashkenas/backbone/issues/3534
  // This flag means that the server has to confirm the creation/deletion before the model will be added/removed to the
  // collection
  options = options || {};
  if (_.isUndefined(options.wait)) {
    options.wait = true;
  }
  // Instead of the response object we are returning the backbone model in the promise
  return _backboneSync.call(Backbone, method, model, options).then(function () {
    return model;
  });
};
angular.module('mwUI.ExceptionHandler', ['mwUI.Modal', 'mwUI.i18n', 'mwUI.UiComponents', 'mwUI.Utils']);

angular.module('mwUI.ExceptionHandler')

  .factory('ExceptionModal', ['Modal', function (Modal) {
    return Modal.prepare({
      templateUrl: 'uikit/mw-exception-handler/modals/templates/mw_exception_modal.html',
      controller: 'ExceptionModalController'
    });
  }])

  .controller('ExceptionModalController', ['$scope', '$q', 'Wizard', function ($scope, $q, Wizard) {
    $scope.exception = null;

    $scope.wizard =  Wizard.createWizard('exception');

    $scope.report = function(){
      $q.when($scope.successCallback()).then(function(){
        $scope.wizard.next();
      });
    };

    $scope.cancel = function(){
      if($scope.errorCallback){
        $q.when($scope.errorCallback()).then(function(){
          $scope.hideModal();
        });
      } else {
        $scope.hideModal();
      }
    };

    $scope.close = function(){
      $scope.hideModal();
    };
  }]);

angular.module('mwUI.ExceptionHandler')

  .provider('$exceptionHandler', function () {

    var _handlers = [];

    return {

      registerHandler: function(callback){
        _handlers.push(callback);
      },

      $get: ['callbackHandler', '$log', function (callbackHandler, $log) {
        return function (exception,cause) {
          exception = exception || '';
          cause = cause || '';

          try{
            _handlers.forEach(function(callback){
              callbackHandler.exec(callback, [exception.toString(), cause.toString()]);
            });
          } catch (err){
            $log.error(err);
          }

          $log.error(exception);
        };
      }]
    };

  });
angular.module('mwUI.ExceptionHandler')

  .provider('exceptionHandlerModal', function () {

    var showExceptionModal = true,
      options = {
        displayException: false,
        userCanEnterMessage: false,
        successCallback: null,
        errorCallback: null
      };

    return {

      disableExceptionModal: function () {
        showExceptionModal = false;
      },

      setModalOptions: function (opts) {
        _.extend(options, opts);
      },

      $get: ['callbackHandler', 'ExceptionModal', function (callbackHandler, ExceptionModal) {

        var exceptionModal = new ExceptionModal();

        var hideNgView = function () {
          var ngView = angular.element.find('div[ng-view]');

          if (ngView) {
            angular.element(ngView).hide();
          }
        };

        return function (exception, cause) {
          if (showExceptionModal) {

            if (options.successCallback) {
              var succCb = options.successCallback;
              options.successCallback = function () {
                return callbackHandler.exec(succCb, [exception.toString(), cause.toString()]);
              };
            }

            if (options.errorCallback) {
              var errCb = options.errorCallback;
              options.errorCallback = function () {
                callbackHandler.exec(errCb, [exception.toString(), cause.toString()]);
              };
            }

            exceptionModal.setScopeAttributes(_.extend({}, options, {
              exception: exception.toString(),
              cause: cause
            }));

            hideNgView();
            exceptionModal.show();
          }
        };
      }]
    };

  });

angular.module('mwUI.ExceptionHandler').config(['$exceptionHandlerProvider', 'i18nProvider', function($exceptionHandlerProvider, i18nProvider){
  $exceptionHandlerProvider.registerHandler('exceptionHandlerModal');
  i18nProvider.addResource('uikit/mw-exception-handler/i18n');
}]);
angular.module('mwUI.Form', ['mwUI.i18n','mwUI.Modal','mwUI.Utils']);

angular.module('mwUI.Form')

  .directive('mwErrorMessages', ['mwValidationMessages', function (mwValidationMessages) {
    return {
      require: '^ngModelErrors',
      templateUrl: 'uikit/mw-form/directives/templates/mw_error_messages.html',
      link: function(scope, el, attrs, ngModelErrorsCtrl){
        scope.errors = ngModelErrorsCtrl.getErrors;

        scope.getMessageForError = function(errorModel){
          return mwValidationMessages.getMessageFor(errorModel.get('error'),errorModel.get('attrs'));
        };
      }
    };
  }]);
var extendForm = function () {
  return {
    restrict: 'E',
    link: function (scope, el) {
      el.addClass('form-horizontal');
      el.attr('novalidate', 'true');
    }
  };
};

angular.module('mwUI.Form')

  .directive('form', extendForm);
angular.module('mwUI.Form')

  .directive('mwFormLeaveConfirmation', ['$window', '$document', '$location', 'i18n', 'Modal', '$compile', function ($window, $document, $location, i18n, Modal, $compile) {
    return {
      require: '^form',
      link: function (scope, elm, attr, formCtrl) {

        var confirmation = $compile('' +
            '<div mw-leave-confirmation="form.$dirty" ' +
            'text="{{\'Form.mwFormLeaveConfirmation.isDirty\' | i18n}}">' +
            '</div>')(scope),
          isActive = true;

        scope.showConfirmation = function () {
          return formCtrl.$dirty && isActive;
        };

        elm.append(confirmation);

        scope.$on('$destroy', function () {
          isActive = false;
        });
      }
    };
  }]);
angular.module('mwUI.Form')

  .directive('mwCheckboxWrapper', function () {
    return {
      transclude: true,
      scope: {
        label: '@',
        tooltip: '@'
      },
      templateUrl: 'uikit/mw-form/directives/templates/mw_checkbox_wrapper.html'
    };
  });
angular.module('mwUI.Form')

  .directive('mwInputWrapper', function () {
    return {
      transclude: true,
      scope: {
        label: '@',
        tooltip: '@',
        hideErrors: '='
      },
      templateUrl: 'uikit/mw-form/directives/templates/mw_input_wrapper.html',
      controller: function () {
        var modelState = {
            dirty: true,
            valid: true,
            touched: false
          },
          inputState = {
            required: false,
            focused: false
          },
          inputType = 'text';

        var setObj = function (obj, val) {
          if (angular.isObject(val)) {
            _.extend(obj, val);
          } else {
            throw new Error('State has to be an object');
          }
        };

        // Will be called by ngModel modification in mw-form/directives/ng-model
        this.setModelState = function (newState) {
          setObj(modelState, newState);
        };

        this.getModelState = function () {
          return modelState;
        };

        // Will be called by ngModel modification in mw-form/directives/ng-model
        this.setInputState = function (newState) {
          setObj(inputState, newState);
        };

        this.getInputState = function () {
          return inputState;
        };

        // Will be called by mwInputDefaults in mw-inputs/directives
        this.setType = function(type){
          inputType = type;
        };

        this.getType = function(){
          return inputType;
        };
      },
      link: function (scope, el, attrs, ctrl) {

        scope.isValid = function () {
          return ctrl.getModelState().valid;
        };

        scope.isDirty = function () {
          return ctrl.getModelState().dirty;
        };

        scope.isTouched = function () {
          return ctrl.getModelState().touched;
        };

        scope.isRequired = function () {
          return ctrl.getInputState().required;
        };

        scope.isFocused = function () {
          return ctrl.getInputState().focused;
        };

        scope.hasError = function () {
          return !scope.hideErrors && !scope.isValid() && scope.isDirty();
        };

        scope.hasRequiredError = function () {
          return scope.isRequired() && !scope.isValid();
        };

        scope.getType = ctrl.getType;
      }
    };
  });
angular.module('mwUI.Form')

  .directive('ngModel', function () {
    return {
      require: ['ngModel', '?^ngModelErrors', '?^mwInputWrapper'],
      link: function (scope, el, attrs, ctrls) {
        var ngModelCtrl = ctrls[0],
          ngModelErrorsCtrl = ctrls[1],
          mwInputWrapperCtrl = ctrls[2],
          inputId = _.uniqueId('input_el');

        var setErrors = function (newErrorObj, oldErrorObj) {
          var newErrors = _.keys(newErrorObj),
            oldErrors = _.keys(oldErrorObj),
            removeErrors = _.difference(oldErrors, newErrors);

          ngModelErrorsCtrl.addErrorsForInput(newErrors, inputId, _.clone(attrs));
          ngModelErrorsCtrl.removeErrorsForInput(removeErrors, inputId, _.clone(attrs));
        };

        var setModelState = function () {
          mwInputWrapperCtrl.setModelState({
            dirty: ngModelCtrl.$dirty,
            valid: ngModelCtrl.$valid,
            touched: ngModelCtrl.$touched
          });
        };

        var initErrorState = function () {
          scope.$watch(function () {
            return ngModelCtrl.$error;
          }, function (newErrorObj, oldErrorObj) {
            setErrors(newErrorObj, oldErrorObj);
          }, true);
        };

        var initModelAndInputState = function () {
          scope.$watch(function () {
            return ngModelCtrl.$error;
          }, setModelState, true);

          scope.$watch(function () {
            return ngModelCtrl.$touched;
          }, setModelState);

          attrs.$observe('required', function(){
            mwInputWrapperCtrl.setInputState({
              required: angular.isDefined(el.attr('required'))
            });
          });

          el.on('focus blur', function(ev){
            mwInputWrapperCtrl.setInputState({
              focused: ev.type === 'focus'
            });
          });
          scope.$on('$destroy', el.off.bind(el));
        };

        if (ngModelErrorsCtrl) {
          initErrorState();
        }

        if(mwInputWrapperCtrl){
          initModelAndInputState();
        }
      }
    };

  });
angular.module('mwUI.Form')

  .directive('ngModelErrors', function () {
    return {
      scope: true,
      controller: function () {
        var ErrorModel = mwUI.Backbone.Model.extend({
            idAttribute: 'error',
            nested: function () {
              return {
                inputIds: Backbone.Collection
              };
            }
          }),
          Errors = Backbone.Collection.extend({
            model: ErrorModel
          }),
          allErrors = new Errors();

        var addErrorForInput = function (error, inputId, attrs) {
          var alreadyExistingError = allErrors.get(error);

          if (alreadyExistingError) {
            var inputIds = alreadyExistingError.get('inputIds');

            _.extend(alreadyExistingError.get('attrs'),attrs);
            inputIds.add({id: inputId});
          } else {
            allErrors.add({error: error, inputIds: [inputId], attrs: attrs});
          }
        };

        var removeErrorForInput = function (error, inputId) {
          var existingError = allErrors.get(error);

          if(existingError){
            var inputIdsInError = existingError.get('inputIds'),
              inputIdModel = inputIdsInError.get(inputId);

            if (inputIdModel) {
              inputIdsInError.remove(inputIdModel);

              if (inputIdsInError.length === 0) {
                allErrors.remove(existingError);
              }
            }
          }
        };

        this.addErrorsForInput = function (errors, inputId, attrs) {
          errors.forEach(function(error){
            addErrorForInput(error, inputId, attrs);
          });
        };

        this.removeErrorsForInput = function (errors, inputId) {
          errors.forEach(function(error){
            removeErrorForInput(error, inputId);
          });
        };

        this.getErrors = function(){
          return allErrors;
        };

      }
    };
  });

angular.module('mwUI.Form')

  .provider('mwValidationMessages', function () {
    var _stringValidators = {},
      _functionValidators = {},
      _executedValidators = {};

    var _setValidationMessage = function (key, validationMessage) {
      if (typeof validationMessage === 'function') {
        _functionValidators[key] = validationMessage;
      } else if (typeof validationMessage === 'string') {
        _stringValidators[key] = validationMessage;
      } else if (validationMessage) {
        throw new Error('The validation has to be either a string or a function. String can be also a reference to i18n');
      }
    };

    this.registerValidator = function (key, validationMessage) {
      if (!_stringValidators[key] && !_functionValidators[key]) {
        _setValidationMessage(key, validationMessage);
      } else {
        throw new Error('The key ' + key + ' has already been registered');
      }
    };

    this.$get = ['$rootScope', 'i18n', function ($rootScope, i18n) {
      var getTranslatedValidator = function (key, options) {
        var message = _stringValidators[key];

        if (i18n.translationIsAvailable(message)) {
          return i18n.get(message, options);
        } else {
          return message;
        }
      };

      var getExecutedValidator = function (key, options) {
        return _functionValidators[key](i18n, options);
      };

      return {
        getRegisteredValidators: function () {
          return _.extend(_stringValidators, _executedValidators);
        },
        getMessageFor: function (key, options) {
          if (_functionValidators[key]) {
            return getExecutedValidator(key, options);
          } else if (_stringValidators[key]) {
            return getTranslatedValidator(key, options);
          }
        },
        updateMessage: function (key, message) {
          if (_stringValidators[key] || _functionValidators[key]) {
            _setValidationMessage(key, message);
          } else {
            throw new Error('The key ' + key + ' is not available. You have to register it first via the provider');
          }
        }
      };
    }];
  });

angular.module('mwUI.Form')

  .config(['i18nProvider', 'mwValidationMessagesProvider', function(i18nProvider, mwValidationMessagesProvider){
    i18nProvider.addResource('uikit/mw-form/i18n');

    mwValidationMessagesProvider.registerValidator('required','mwErrorMessages.required');
    mwValidationMessagesProvider.registerValidator('email','mwErrorMessages.hasToBeValidEmail');
    mwValidationMessagesProvider.registerValidator('pattern','mwErrorMessages.hasToMatchPattern');
    mwValidationMessagesProvider.registerValidator('url','mwErrorMessages.hasToBeValidUrl');
    mwValidationMessagesProvider.registerValidator('phone','mwErrorMessages.hasToBeValidPhoneNumber');
    mwValidationMessagesProvider.registerValidator('min','mwErrorMessages.hasToBeMin');
    mwValidationMessagesProvider.registerValidator('minlength','mwErrorMessages.hasToBeMinLength');
    mwValidationMessagesProvider.registerValidator('max','mwErrorMessages.hasToBeSmaller');
    mwValidationMessagesProvider.registerValidator('maxlength','mwErrorMessages.hasToBeSmallerLength');
  }]);
angular.module('mwUI.i18n', [

]);

angular.module('mwUI.i18n')

  .provider('i18n', function () {

    var _resources = [],
      _locales = [],
      _dictionary = {},
      _isLoadingresources = false,
      _oldLocale = null,
      _defaultLocale = null;

    var _getActiveLocale = function () {
      // This variable was set from 'LanguageService' in method setDefaultLocale()
      return _.findWhere(_locales, {active: true});
    };

    var _setActiveLocale = function (locale) {
      var oldLocale = _getActiveLocale(),
        newLocale = _.findWhere(_locales, {id: locale});

      if (newLocale) {
        if (oldLocale) {
          oldLocale.active = false;
        }

        newLocale.active = true;
      } else {
        throw new Error('You can not set a locale that has not been registered. Please register the locale first by calling addLocale()');
      }
    };

    /**
     * Returns a translation for a key when a translation is available otherwise false
     * @param key {String}
     * @returns {*}
     * @private
     */
    var _getTranslationForKey = function (key) {
      var activeLocale = _oldLocale || _getActiveLocale();

      if(activeLocale && _dictionary && _dictionary[activeLocale.id]){
        var translation = _dictionary[activeLocale.id];
        angular.forEach(key.split('.'), function (k) {
          translation = translation ? translation[k] : null;
        });
        return translation;
      } else {
        return false;
      }
    };

    /**
     * Checks all locales for an available translation until it finds one
     * @param property {String}
     * @returns {*}
     * @private
     */
    var _getContentOfOtherLocale = function (property) {
      var result;
      _.each(_locales, function (locale) {
        if (!result && property[locale.id]) {
          result = property[locale.id];
        }
      });
      if(!result){
        result = _.values(property)[0];
      }
      return result;
    };

    /**
     * Return all placeholders that are available in the translation string
     * @param property {String}
     * @returns {String}
     * @private
     */
    var _getUsedPlaceholdersInTranslationStr = function(str){

      var re = /{{\s*([a-zA-Z0-9$_]+)\s*}}/g,
        usedPlaceHolders = [],
        matches;

      while ((matches = re.exec(str)) !== null) {
        if (matches.index === re.lastIndex) {
          re.lastIndex++;
        }
        usedPlaceHolders.push(matches[1]);
      }

      return usedPlaceHolders;
    };

    /**
     * Replaces placeholders in transaltion string with a value defined in the placeholder param
     * @param str
     * @param placeholder
     * @returns {String}
     * @private
     */
    var _replacePlaceholders = function (str, placeholders) {
      if(placeholders){
        var usedPlaceHolders = _getUsedPlaceholdersInTranslationStr(str);
        usedPlaceHolders.forEach(function(usedPlaceholder){
          var escapedPlaceholder = usedPlaceholder.replace(/[$_]/g,'\\$&'),
            replaceRegex = new RegExp('{{\\s*'+escapedPlaceholder+'\\s*}}');

          str = str.replace(replaceRegex, placeholders[usedPlaceholder]);
        });
      }
      return str;
    };

    /**
     * Registers a locale for which translations are available
     * @param locale
     * @param name
     * @param fileExtension
     */
    this.addLocale = function (locale, name, fileExtension) {
      if (!_.findWhere(_locales, {id: locale})) {
        _locales.push({
          id: locale,
          name: name,
          active: locale === _defaultLocale,
          fileExtension: fileExtension || locale + '.json'
        });
        _dictionary[locale] = {};
      }
    };

    /**
     * Registers a resource so it can be accessed later by calling the public method get
     * @param resourcePath {String}
     * @param fileNameForLocale {String}
     */
    this.addResource = function (resourcePath) {
      if (!_.findWhere(_resources, {path: resourcePath})) {
        _resources.push({
          path: resourcePath
        });
      }
    };

    this.setDefaultLocale = function (locale) {
      _defaultLocale = locale;
      if(_.findWhere(_locales, {id: locale})){
        _setActiveLocale(locale);
      }
    };

    this.$get = ['$templateRequest', '$q', '$rootScope', function ($templateRequest, $q, $rootScope) {
      return {
        /**
         * Fills the dictionary with the translations by using the angular templateCache
         * We need the dictionary because the get method has to be synchronous for the angular filter
         * @param resourcePath {String}
         */
        _loadResource: function (resourcePath) {
          var resource = _.findWhere(_resources, {path: resourcePath}),
            activeLocale = this.getActiveLocale(),
            fileName = '';

          if (resource && activeLocale) {
            fileName = activeLocale.fileExtension;

            return $templateRequest(resource.path + '/' + fileName).then(function (content) {
              _.extend(_dictionary[activeLocale.id], JSON.parse(content));
              return content;
            });
          } else {
            return $q.reject('Resource not available or no locale has been set');
          }
        },

        /**
         * Returns all registered locales
         * @returns {Array}
         */
        getLocales: function(){
          return _locales;
        },

        /**
         * Return the currently active locale
         * @returns {Object}
         */
        getActiveLocale: function () {
          return _getActiveLocale();
        },

        /**
         * translates key into current locale, given placeholders in {{placeholderName}} are replaced
         * @param key {String}
         * @param placeholder {Object}
         */
        get: function (key, placeholder) {
          var translation = _getTranslationForKey(key);
          if (translation) {
            return _replacePlaceholders(translation, placeholder);
          } else if(_isLoadingresources){
            return '...';
          } else {
            return 'MISSING TRANSLATION ' + this.getActiveLocale().id + ': ' + key;
          }
        },

        /**
         * set the locale and loads all resources for that locale
         * @param locale {String}
         */
        setLocale: function (localeid) {
          var loadTasks = [];
          _isLoadingresources = true;
          _oldLocale = this.getActiveLocale();
          _setActiveLocale(localeid);
          _.each(_resources, function (resource) {
            loadTasks.push(this._loadResource(resource.path));
          }, this);
          return $q.all(loadTasks).then(function () {
            _isLoadingresources = false;
            _oldLocale = null;
            $rootScope.$broadcast('i18n:localeChanged', localeid);
            return localeid;
          });
        },

        /**
         * checks if a translation for the key is available
         * @param key {String}
         * @returns {boolean}
         */
        translationIsAvailable: function(key){
          return !!_getTranslationForKey(key);
        },
        /**
         * return value of an internationalized object e.g {en_US:'English text', de_DE:'German text'}
         * When no translation is availabe for the current set locale it tries the default locale.
         * When no translation is available for the defaultLocale it tries all other available locales until
         * a translation is found
         * @param property {object}
         * @returns {String}
         */
        localize: function (property) {
          var activeLocale = this.getActiveLocale();
          var p = property[activeLocale.id];
          if (angular.isDefined(p) && p !== '') {
            return p;
          } else {
            return property[_defaultLocale] || _getContentOfOtherLocale(property);
          }
        }
      };
    }];

  });
angular.module('mwUI.i18n')

  .filter('i18n', ['i18n', function (i18n) {

    function i18nFilter(translationKey, placeholder) {
      if (_.isString(translationKey)) {
        return i18n.get(translationKey, placeholder);
      } else if(_.isObject(translationKey)){
        return i18n.localize(translationKey);
      }
    }

    i18nFilter.$stateful = true;

    return i18nFilter;
  }]);
angular.module('mwUI.Inputs', ['mwUI.i18n', 'mwUI.Backbone']);

angular.module('mwUI.Inputs')

  .directive('input', function () {
    return {
      restrict: 'E',
      link: function (scope, el, attrs) {
        // render custom checkbox
        // to preserve the functionality of the original checkbox we just wrap it with a custom element
        // checkbox is set to opacity 0 and has to be positioned absolute inside the custom checkbox element which has to be positioned relative
        // additionally a custom status indicator is appended as a sibling of the original checkbox inside the custom checkbox wrapper
        var render = function () {
          var customCheckbox = angular.element('<span class="custom-checkbox mw-checkbox"></span>'),
            customCheckboxStateIndicator = angular.element('<span class="state-indicator"></span>'),
            customCheckboxStateFocusIndicator = angular.element('<span class="state-focus-indicator"></span>');

          el.wrap(customCheckbox);
          customCheckboxStateIndicator.insertAfter(el);
          customCheckboxStateFocusIndicator.insertAfter(customCheckboxStateIndicator);
        };

        var init = function() {
          //after this the remaining element is removed
          scope.$on('$destroy', function () {
            el.off();
            el.parent('.mw-checkbox').remove();
          });

          render();

        };

        if(attrs.type==='checkbox'){
          init();
        }
      }
    };
  });
angular.module('mwUI.Inputs')

  .directive('mwCheckboxGroup', ['i18n', function (i18n) {
    return {
      restrict: 'A',
      scope: {
        mwCollection: '=',
        mwOptionsCollection: '=',
        mwOptionsLabelKey: '@',
        mwOptionsLabelI18nPrefix: '@',
        mwRequired: '=',
        mwDisabled: '='
      },
      templateUrl: 'uikit/mw-inputs/directives/templates/mw_checkbox_group.html',
      link: function (scope) {
        scope.getLabel = function(model){
          var modelAttr = model.get(scope.mwOptionsLabelKey);

          if(modelAttr){
            if(scope.mwOptionsLabelI18nPrefix){
              return i18n.get(scope.mwOptionsLabelI18nPrefix+'.'+modelAttr);
            } else {
              return modelAttr;
            }
          }
        };
        
        scope.isOptionDisabled = function(model){
          return model.selectable.isDisabled();
        };

        scope.toggleModel = function (model) {
          var existingModel = scope.mwCollection.findWhere(model.toJSON());
          if (existingModel) {
            scope.mwCollection.remove(existingModel);
          } else {
            scope.mwCollection.add(model.toJSON());
          }
        };
      }
    };
  }]);
var extendInput = function () {
  return {
    restrict: 'E',
    require: '?^mwInputWrapper',
    link: function (scope, el, attrs, mwInputWrapperCtrl) {
      var skipTypes = ['radio','checkbox'];

      if(skipTypes.indexOf(attrs.type)===-1){
        el.addClass('form-control');
      }
      
      if(mwInputWrapperCtrl){
        if(attrs.type){
          mwInputWrapperCtrl.setType(attrs.type);
        } else if(el[0].tagName){
          mwInputWrapperCtrl.setType(el[0].tagName.toLowerCase());
        }
      }
    }
  };
};

angular.module('mwUI.Inputs')

  .directive('select', extendInput)

  .directive('input', extendInput)

  .directive('textarea', extendInput);

angular.module('mwUI.Inputs')

  .directive('input', function () {
    return {
      restrict: 'E',
      link: function (scope, el, attrs) {
        // render custom radio
        // to preserve the functionality of the original checkbox we just wrap it with a custom element
        // checkbox is set to opacity 0 and has to be positioned absolute inside the custom checkbox element which has to be positioned relative
        // additionally a custom status indicator is appended as a sibling of the original checkbox inside the custom checkbox wrapper
        var render = function () {
          var customRadio = angular.element('<span class="custom-radio mw-radio"></span>'),
            customRadioStateIndicator = angular.element('<span class="state-indicator"></span>'),
            customRadioStateFocusIndicator = angular.element('<span class="state-focus-indicator"></span>');

          el.wrap(customRadio);
          customRadioStateIndicator.insertAfter(el);
          customRadioStateFocusIndicator.insertAfter(customRadioStateIndicator);
        };

        var init = function() {
          //after this the remaining element is removed
          scope.$on('$destroy', function () {
            el.off();
            el.parent('.mw-radio').remove();
          });

          render();

        };

        if(attrs.type === 'radio'){
          init();
        }
      }
    };
  });
angular.module('mwUI.Inputs')

  .directive('mwRadioGroup', ['i18n', function (i18n) {
    return {
      restrict: 'A',
      scope: {
        mwModel: '=',
        mwModelAttr: '@',
        mwOptionsCollection: '=',
        mwOptionsKey: '@',
        mwOptionsLabelKey: '@',
        mwOptionsLabelI18nPrefix: '@',
        mwRequired: '=',
        mwDisabled: '='
      },
      templateUrl: 'uikit/mw-inputs/directives/templates/mw_radio_group.html',
      link: function (scope) {
        scope.radioGroupId = _.uniqueId('radio_');

        var setBackboneModel = function(model){
          if(scope.mwModelAttr){
            scope.mwModel.set(scope.mwModelAttr, model.get(scope.mwOptionsKey));
          } else {
            scope.mwModel.set(model.toJSON());
          }
        };

        var unSetBackboneModel = function(){
          if(scope.mwModelAttr){
            scope.mwModel.unset(scope.mwModelAttr);
          } else {
            scope.mwModel.clear();
          }
        };

        scope.getLabel = function (model) {
          var modelAttr = model.get(scope.mwOptionsLabelKey);

          if (modelAttr) {
            if (scope.mwOptionsLabelI18nPrefix) {
              return i18n.get(scope.mwOptionsLabelI18nPrefix + '.' + modelAttr);
            } else {
              return modelAttr;
            }
          }
        };

        scope.isOptionDisabled = function (model) {
          return model.selectable.isDisabled();
        };

        scope.getModelAttribute = function(){
          return scope.mwModelAttr || scope.mwModel.idAttribute;
        };

        scope.isChecked = function (model) {
          if(scope.mwModelAttr){
            return model.get(scope.mwOptionsKey) === scope.mwModel.get(scope.mwModelAttr);
          } else {
            return model.id === scope.mwModel.id;
          }
        };

        scope.selectOption = function (model) {
          if (!scope.isChecked(model)) {
            setBackboneModel(model);
          } else {
            unSetBackboneModel();
          }
        };

        if(scope.mwModelAttr && !scope.mwOptionsKey){
          throw new Error('[mwRadioGroup] When using mwModelAttr the attribute mwOptionsKey is required!');
        }
      }
    };
  }]);
angular.module('mwUI.Inputs')

  .directive('select', function () {
    return {
      link: function (scope, el) {
        var customSelectWrapper = angular.element('<span class="mw-select"></span>');

        var render = function () {
          el.wrap(customSelectWrapper);
          el.addClass('custom');
        };

        render();
      }
    };
  });
angular.module('mwUI.Inputs')

  .directive('mwSelectBox', ['i18n', function (i18n) {
    return {
      restrict: 'A',
      scope: {
        mwModel: '=',
        mwModelAttr: '@',
        mwOptionsCollection: '=',
        mwOptionsKey: '@',
        mwOptionsLabelKey: '@',
        mwOptionsLabelI18nPrefix: '@',
        mwPlaceholder: '@',
        mwRequired: '=',
        mwDisabled: '='
      },
      templateUrl: 'uikit/mw-inputs/directives/templates/mw_select_box.html',
      link: function (scope) {

        scope.viewModel = {};

        var setBackboneModel = function(model){
          if(scope.mwModelAttr){
            scope.mwModel.set(scope.mwModelAttr, model.get(scope.mwOptionsKey));
          } else {
            scope.mwModel.set(model.toJSON());
          }
        };

        var unSetBackboneModel = function(){
          if(scope.mwModelAttr){
            scope.mwModel.unset(scope.mwModelAttr);
          } else {
            scope.mwModel.clear();
          }
        };

        var setSelectedVal = function(){
          if(scope.mwModel.id){
            scope.viewModel.selected = scope.mwModel.id.toString();
          }
        };

        scope.getLabel = function (model) {
          var modelAttr = model.get(scope.mwOptionsLabelKey);

          if (modelAttr) {
            if (scope.mwOptionsLabelI18nPrefix) {
              return i18n.get(scope.mwOptionsLabelI18nPrefix + '.' + modelAttr);
            } else {
              return modelAttr;
            }
          }
        };

        scope.hasPlaceholder = function(){
          return scope.mwPlaceholder || scope.mwRequired;
        };

        scope.getPlaceholder = function(){
          if(scope.mwPlaceholder){
            return scope.mwPlaceholder;
          } else if(scope.mwRequired){
            return i18n.get('mwSelectBox.pleaseSelect');
          }
        };

        scope.isOptionDisabled = function (model) {
          return model.selectable.isDisabled();
        };

        scope.getModelAttribute = function(){
          return scope.mwModelAttr || scope.mwModel.idAttribute;
        };

        scope.isChecked = function (model) {
          if(scope.mwModelAttr){
            return model.get(scope.mwOptionsKey) === scope.mwModel.get(scope.mwModelAttr);
          } else {
            return model.id === scope.mwModel.id;
          }
        };

        scope.select = function(id){
          if(id){
            scope.selectOption(scope.mwOptionsCollection.get(id));
          } else {
            unSetBackboneModel();
          }
        };

        scope.selectOption = function (model) {
          if (!scope.isChecked(model)) {
            setBackboneModel(model);
          } else {
            unSetBackboneModel();
          }
        };

        if(scope.mwModel){
          scope.mwModel.on('change:'+scope.mwModel.idAttribute, setSelectedVal);
          setSelectedVal();
        }

        if(scope.mwModelAttr && !scope.mwOptionsKey){
          throw new Error('[mwRadioGroup] When using mwModelAttr the attribute mwOptionsKey is required!');
        }
      }
    };
  }]);
angular.module('mwUI.Inputs')

  .directive('mwToggle', ['$timeout', function ($timeout) {
    return {
      scope: {
        mwModel: '=',
        mwDisabled: '=',
        mwChange: '&'
      },
      replace: true,
      templateUrl: 'uikit/mw-inputs/directives/templates/mw_toggle.html',
      link: function (scope) {
        scope.toggle = function (value) {
          if (scope.mwModel !== value) {
            scope.mwModel = !scope.mwModel;
            $timeout(function () {
              scope.mwChange({value: scope.mwModel});
            });
          }
        };
      }
    };
  }]);

angular.module('mwUI.Inputs')
  .config(['i18nProvider', function(i18nProvider) {
    i18nProvider.addResource('uikit/mw-inputs/i18n');
  }]);
angular.module('mwUI.Layout', []);

angular.module('mwUI.Layout')

  .directive('mwColumnLayout', function () {
    return {
      link: function(scope, el){
        el.addClass('mw-column-layout');
      }
    };
  });
angular.module('mwUI.Layout')

  .directive('mwHeader', ['$rootScope', '$route', '$location', function ($rootScope, $route, $location) {
    return {
      transclude: true,
      scope: {
        title: '@',
        url: '@',
        mwTitleIcon: '@',
        showBackButton: '=',
        mwBreadCrumbs: '='
      },
      templateUrl: 'uikit/mw-layout/directives/templates/mw_header.html',
      link: function (scope, el, attrs, ctrl, $transclude) {
        $rootScope.siteTitleDetails = scope.title;

        $transclude(function (clone) {
          if ((!clone || clone.length === 0) && !scope.showBackButton) {
            el.find('.mw-header').addClass('no-buttons');
          }
        });

        scope.refresh = function () {
          $route.reload();
        };

        if (!scope.url && scope.mwBreadCrumbs && scope.mwBreadCrumbs.length > 0) {
          scope.url = scope.mwBreadCrumbs[scope.mwBreadCrumbs.length - 1].url;
          scope.url = scope.url.replace('#', '');
        } else if (!scope.url && scope.showBackButton) {
          console.error('Url attribute in header is missing!!');
        }

        scope.back = function () {
          $location.path(scope.url);
        };

      }
    };
  }]);
angular.module('mwUI.Layout')

  .directive('mwRow', function () {
    return {
      require: '^mwRowLayout',
      link: function(scope, el, attrs, mwRowLayoutCtrl){
        var parObserver,
            elObserver,
            parentEl = el.parent();

        var calculateHeight = function(){
          var rows = mwRowLayoutCtrl.getRegistered(),
              heightOfOtherEls = 0;

          rows.forEach(function(row){
            if(row.el !== el){
              heightOfOtherEls += row.el.height();
            }
          });
          el.css('height','calc(100vh - '+heightOfOtherEls+'px)');
        };

        el.addClass('mw-row');
        mwRowLayoutCtrl.register({scope: scope, el:el});

        if(angular.isDefined(attrs.mwExtend)){
          parObserver = mwUI.Utils.shims.domObserver(parentEl, calculateHeight);
          elObserver = mwUI.Utils.shims.domObserver(el, calculateHeight);
          scope.$on('$destroy', function(){
            parObserver.disconnect();
            elObserver.disconnect();
          });
        }

      }
    };
  });
angular.module('mwUI.Layout')

  .directive('mwRowLayout', function () {
    return {
      require: '?^^mwRowLayout',
      controller: function(){
        var rows = [];
        this.register = function(row){
          rows.push(row);
        };

        this.getRegistered = function(){
          return rows;
        };
      },
      link: function(scope, el){
        el.addClass('mw-row-layout');
      }
    };
  });
angular.module('mwUI.Layout')

  .directive('mwSubNav', function () {
    return {
      restrict: 'A',
      scope: {
        justified: '='
      },
      transclude: true,
      replace: true,
      templateUrl: 'uikit/mw-layout/directives/templates/mw_sub_nav.html'
    };
  });
angular.module('mwUI.Layout')

  .directive('mwSubNavPill', ['$location', function ($location) {
    return {
      restrict: 'A',
      scope: {
        url: '@mwSubNavPill',
        mwDisabled: '='
      },
      transclude: true,
      replace: true,
      templateUrl: 'uikit/mw-layout/directives/templates/mw_sub_nav_pill.html',
      link: function (scope, elm) {
        var setActiveClassOnUrlMatch = function (url) {
          if (scope.url && url === scope.url.slice(1)) {
            elm.addClass('active');
          } else {
            elm.removeClass('active');
          }
        };

        scope.$watch('url', function (newUrlAttr) {
          if (newUrlAttr) {
            setActiveClassOnUrlMatch($location.$$path);
          }
        });

        scope.navigate = function(url){
          if(!scope.mwDisabled){
            url = url.replace(/#\//,'');
            $location.path(url);
            $location.replace();
          }
        };

        setActiveClassOnUrlMatch($location.$$path);

      }
    };
  }]);
angular.module('mwUI.List', ['mwUI.i18n', 'mwUI.Backbone']);

angular.module('mwUI.List')

  //Todo rename to mwList
  .directive('mwListableBb', function(){
    return {
      //TODO rename collection to mwCollection
      //Move sort and filter persistance into filterable and remove mwListCollection
      scope: {
        collection: '=',
        mwListCollection: '='
      },
      compile: function (elm) {
        elm.append('<tfoot mw-listable-footer-bb></tfoot>');

        return function (scope, elm) {
          elm.addClass('table table-striped mw-list');
        };
      },
      controller: ['$scope', function ($scope) {
        var _columns = $scope.columns = [],
          _collection = null,
          _mwListCollectionFilter = null;

        this.actionColumns = [];

        this.registerColumn = function (scope) {
          _columns.push(scope);
        };

        this.unRegisterColumn = function (scope) {
          if (scope && scope.$id) {
            var scopeInArray = _.findWhere(_columns, {$id: scope.$id}),
              indexOfScope = _.indexOf(_columns, scopeInArray);

            if (indexOfScope > -1) {
              _columns.splice(indexOfScope, 1);
            }
          }
        };

        this.getColumns = function () {
          return _columns;
        };

        this.getCollection = function () {
          return _collection;
        };

        this.isSingleSelection = function () {
          if (_collection && _collection.selectable) {
            return _collection.selectable.isSingleSelection();
          }
          return false;
        };

        $scope.$on('$destroy', function () {
          this.actionColumns = [];
        }.bind(this));

        if ($scope.mwListCollection) {
          _collection = $scope.mwListCollection.getCollection();
          _mwListCollectionFilter = $scope.mwListCollection.getMwListCollectionFilter();
        } else if ($scope.collection) {
          _collection = $scope.collection;
        }
      }]
    };
  });
angular.module('mwUI.List')

  //TODO rename to mwListBodyRow
  .directive('mwListableBodyRowBb', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      require: '^mwListableBb',
      compile: function (elm) {

        elm.prepend('<td  ng-if="collection.selectable && item.selectable" mw-list-body-row-checkbox item="item"></td>');

        return function (scope, elm, attr, mwListCtrl) {
          var selectedClass = 'selected';

          scope.collection = mwListCtrl.getCollection();

          if (!scope.item) {
            throw new Error('No item available in the list! Please make sure to use ng-repeat="item in collection"');
          }

          if (scope.item && scope.item.selectable && !scope.item.selectable.isDisabled()) {
            elm.addClass('selectable clickable');
          } else if (mwListCtrl.actionColumns && mwListCtrl.actionColumns.length > 0) {
            elm.addClass('clickable');
          }

          elm.on('click', function () {
            if (scope.item && scope.item.selectable && !scope.item.selectable.isDisabled()) {
              $timeout(function () {
                scope.item.selectable.toggleSelect();
              });
            }
          });

          elm.on('dblclick', function () {
            if (mwListCtrl.actionColumns && angular.isNumber(scope.$index) && mwListCtrl.actionColumns[scope.$index]) {
              document.location.href = mwListCtrl.actionColumns[scope.$index];
            }
          });

          scope.$watch('item.selectable.isSelected()', function (value) {
            if (value) {
              elm.addClass(selectedClass);
            } else {
              elm.removeClass(selectedClass);
            }
          });
        };
      }
    };
  }]);
angular.module('mwUI.List')

  .directive('mwListBodyRowCheckbox', function () {
    return {
      restrict: 'A',
      require: '^mwListableBb',
      scope: {
        item: '='
      },
      templateUrl: 'uikit/mw-list/directives/templates/mw_list_body_row_checkbox.html',
      link: function (scope, elm, attr, mwListCtrl) {
        scope.isSingleSelection = mwListCtrl.isSingleSelection();
        scope.click = function (item, $event) {
          $event.stopPropagation();
          if (item.selectable) {
            item.selectable.toggleSelect();
          }
        };

        scope.$watch('item.selectable.isDisabled()', function (isDisabled) {
          if (isDisabled) {
            scope.item.selectable.unSelect();
          }
        });
      }
    };
  });
angular.module('mwUI.List')
  //TODO rename
  .directive('mwListableFooterBb', function () {
    return {
      require: '^mwListableBb',
      templateUrl: 'uikit/mw-list/directives/templates/mw_list_footer.html',
      link: function (scope, elm, attr, mwListCtrl) {
        scope.collection = mwListCtrl.getCollection();
        scope.columns = mwListCtrl.getColumns();

        scope.showSpinner = function(){
          return /*Loading.isLoading() &&*/ scope.collection.filterable.hasNextPage();
        };
      }
    };
  });
angular.module('mwUI.List')

  // TODO:  rename to something else
  // TODO: extract functionalities into smaller directives
  .directive('mwListableHead2', ['$window', '$document', 'i18n', function ($window, $document, i18n) {
    return {
      scope: {
        collection: '=',
        affix: '=',
        affixOffset: '=',
        collectionName: '@',
        nameFn: '&',
        nameAttribute: '@',
        localizeName: '@',
        nameI18nPrefix: '@',
        nameI18nSuffix: '@',
        searchAttribute: '@'
      },
      transclude: true,
      templateUrl: 'uikit/mw-list/directives/templates/mw_list_head.html',
      link: function (scope, el, attrs, ctrl, $transclude) {
        var scrollEl,
          bodyEl = angular.element('body'),
          modalEl = el.parents('.modal .modal-body'),
          canShowSelected = false,
          _affix = angular.isDefined(scope.affix) ? scope.affix : true,
          windowEl = angular.element($window);

        scope.selectable = false;
        scope.selectedAmount = 0;
        scope.collectionName = scope.collectionName || i18n.get('List.mwListHead.items');
        scope.isModal = modalEl.length > 0;
        scope.isLoadingModelsNotInCollection = false;
        scope.hasFetchedModelsNotInCollection = false;
        scope.isLoadingModelsNotInCollection = false;
        scope.hasFetchedModelsNotInCollection = false;


        var newOffset;

        var throttledScrollFn = _.throttle(function () {
          if (!newOffset) {
            var headerOffset,
              headerHeight,
              headerBottomOffset,
              listHeaderOffset,
              spacer;

            if (scope.isModal) {
              headerOffset = angular.element('.modal-header').offset().top;
              headerHeight = angular.element('.modal-header').innerHeight();
              spacer = -3;
            } else {
              headerOffset = angular.element('[mw-header]').offset().top;
              headerHeight = angular.element('[mw-header]').innerHeight();
              spacer = 5;
            }

            headerBottomOffset = headerOffset + headerHeight;
            listHeaderOffset = el.offset().top;

            newOffset = listHeaderOffset - headerBottomOffset - spacer;
          }

          var scrollTop = scrollEl.scrollTop();

          if (scrollTop > newOffset && _affix) {
            el.find('.mw-listable-header').css('top', scrollTop - newOffset);
            el.addClass('affixed');
          } else if (!_affix) {
            scrollEl.off('scroll', throttledScrollFn);
          } else {
            el.find('.mw-listable-header').css('top', 'initial');
            el.removeClass('affixed');
          }

        }, 10);

        var throttledRecalculate = _.throttle(function () {
          el.find('.mw-listable-header').css('top', 'initial');
          newOffset = null;
        });

        var loadItemsNotInCollection = function () {
          if (scope.hasFetchedModelsNotInCollection) {
            return;
          }
          var selectedNotInCollection = [];
          scope.selectable.getSelected().each(function (model) {
            if (!model.selectable.isInCollection && !scope.getModelAttribute(model)) {
              selectedNotInCollection.push(model);
            }
          });

          if (selectedNotInCollection.length === 0) {
            return;
          }

          var Collection = scope.collection.constructor.extend({
            filterableOptions: function () {
              return {
                filterDefinition: function () {
                  var filter = new window.mCAP.Filter(),
                    filters = [];

                  selectedNotInCollection.forEach(function (model) {
                    if (model.id) {
                      filters.push(
                        filter.string(model.idAttribute, model.id)
                      );
                    }
                  });

                  return filter.or(filters);
                }
              };
            }
          });
          var collection = new Collection();
          collection.url = scope.collection.url();

          scope.isLoadingModelsNotInCollection = true;

          collection.fetch().then(function (collection) {
            scope.hasFetchedModelsNotInCollection = true;
            var selected = scope.selectable.getSelected();
            collection.each(function (model) {
              selected.get(model.id).set(model.toJSON());
            });

            var deletedUuids = _.difference(_.pluck(selectedNotInCollection, 'id'), collection.pluck('uuid'));

            deletedUuids.forEach(function (id) {
              selected.get(id).selectable.isDeletedItem = true;
            });

            scope.isLoadingModelsNotInCollection = false;
          });
        };

        scope.showSelected = function () {
          canShowSelected = true;
          loadItemsNotInCollection();
          setTimeout(function () {
            var height;
            if (scope.isModal) {
              height = modalEl.height() + (modalEl.offset().top - el.find('.selected-items').offset().top) + 25;
              modalEl.css('overflow', 'hidden');
            } else {
              height = angular.element($window).height() - el.find('.selected-items').offset().top + scrollEl.scrollTop() - 25;
              bodyEl.css('overflow', 'hidden');
            }

            el.find('.selected-items').css('height', height);
            el.find('.selected-items').css('bottom', height * -1);
          });
        };

        scope.hideSelected = function () {
          if (scope.isModal) {
            modalEl.css('overflow', 'auto');
          } else {
            bodyEl.css('overflow', 'inherit');
          }
          canShowSelected = false;
        };

        scope.canShowSelected = function () {
          return scope.selectable && canShowSelected && scope.selectedAmount > 0;
        };

        scope.unSelect = function (model) {
          model.selectable.unSelect();
        };

        scope.toggleSelectAll = function () {
          scope.selectable.toggleSelectAll();
        };

        scope.getTotalAmount = function () {
          if (scope.collection.filterable && scope.collection.filterable.getTotalAmount()) {
            return scope.collection.filterable.getTotalAmount();
          } else {
            return scope.collection.length;
          }
        };

        scope.toggleShowSelected = function () {
          if (canShowSelected) {
            scope.hideSelected();
          } else {
            scope.showSelected();
          }
        };

        scope.getModelAttribute = function (model) {
          if (scope.nameAttribute) {
            var modelAttr = model.get(scope.nameAttribute);

            if (scope.nameI18nPrefix || scope.nameI18nSuffix) {
              var i18nPrefix = scope.nameI18nPrefix || '',
                i18nSuffix = scope.nameI18nSuffix || '';

              return i18n.get(i18nPrefix + '.' + modelAttr + '.' + i18nSuffix);
            } else if (angular.isDefined(scope.localizeName)) {
              return i18n.localize(modelAttr);
            } else {
              return modelAttr;
            }
          } else {
            return scope.nameFn({item: model});
          }
        };

        var init = function () {
          scope.selectable = scope.collection.selectable;
          if (scope.isModal) {
            //element in modal
            scrollEl = modalEl;
          }
          else {
            //element in window
            scrollEl = windowEl;
          }

          // Register scroll callback
          scrollEl.on('scroll', throttledScrollFn);

          scrollEl.on('resize', throttledRecalculate);

          // Deregister scroll callback if scope is destroyed
          scope.$on('$destroy', function () {
            scrollEl.off('scroll', throttledScrollFn);
          });

          scope.$on('$destroy', function () {
            scrollEl.off('resize', throttledRecalculate);
          });

          el.on('focus', 'input[type=text]', function () {
            el.find('.search-bar').addClass('focused');
          });

          el.on('blur', 'input[type=text]', function () {
            el.find('.search-bar').removeClass('focused');
          });
        };

        $transclude(function (clone) {
          if (clone && clone.length > 0) {
            el.addClass('has-extra-content');
          }
        });

        scope.$watch(function () {
          if (scope.selectable) {
            return scope.selectable.getSelected().length;
          } else {
            return 0;
          }
        }, function (val) {
          scope.selectedAmount = val;
          if (val < 1) {
            scope.hideSelected();
          }
        });

        scope.$watch('collection', function (collection) {
          if (collection) {
            init();
          }
        });
      }
    };
  }]);
angular.module('mwUI.List')

  //TODO rename to mwListHeader
  .directive('mwListableHeaderBb', function () {
    return {
      require: '^mwListableBb',
      scope: {
        property: '@sort'
      },
      transclude: true,
      replace: true,
      templateUrl: 'uikit/mw-list/directives/templates/mw_list_header.html',
      link: function (scope, elm, attr, mwListCtrl) {
        var ascending = '+',
          descending = '-',
          collection = mwListCtrl.getCollection();

        var getSortOrder = function () {
          if (collection && collection.filterable) {
            return collection.filterable.getSortOrder();
          } else {
            return false;
          }
        };

        var sort = function (property, order) {
          var sortOrder = order + property;

          collection.filterable.setSortOrder(sortOrder);
          return collection.fetch();
        };

        scope.canBeSorted = function(){
          return angular.isString(scope.property) && scope.property.length > 0 && !!collection.filterable;
        };

        scope.toggleSortOrder = function () {
          if (scope.canBeSorted()) {
            var sortOrder = ascending; //default
            if (getSortOrder() === ascending + scope.property) {
              sortOrder = descending;
            }
            sort(scope.property, sortOrder);
          }
        };

        scope.isSelected = function (prefix) {
          var sortOrder = getSortOrder();

          if (sortOrder && prefix) {
            return sortOrder === prefix + scope.property;
          } else if(sortOrder && !prefix){
            return (sortOrder === '+' + scope.property || sortOrder === '-' + scope.property);
          }
        };

        mwListCtrl.registerColumn(scope);

        scope.$on('$destroy', function () {
          mwListCtrl.unRegisterColumn(scope);
        });
      }
    };
  });
angular.module('mwUI.List')

  //TODO rename to mwListHeaderRow
  .directive('mwListableHeaderRowBb', function () {
    return {
      require: '^mwListableBb',
      scope: true,
      compile: function (elm) {
        elm.prepend('<th ng-if="hasCollection" width="1%"></th>');
        elm.append('<th ng-if="actionColumns.length > 0" colspan="{{ actionColumns.length }}" width="1%" class="action-button"></th>');

        return function (scope, elm, attr, mwListCtrl) {
          //empty collection is [] so ng-if would not work as expected
          //we also have to check if the collection has a selectable
          scope.hasCollection = false;
          var collection = mwListCtrl.getCollection();
          if (collection) {
            scope.hasCollection = angular.isDefined(collection.length) && collection.selectable;
          }
          scope.actionColumns = mwListCtrl.actionColumns;
        };
      }
    };
  });
angular.module('mwUI.List')
  //TODO rename to mwListUrlActionButton
  .directive('mwListableLinkShowBb', function () {
    return {
      restrict: 'A',
      require: '^mwListableBb',
      scope: {
        link: '@mwListableLinkShowBb'
      },
      template: '<span mw-link-show="{{link}}"></span>',
      link: function (scope, elm, attr, mwListableCtrl) {
        mwListableCtrl.actionColumns.push(scope.link);
      }
    };
  });

angular.module('mwUI.List')

  .config(['i18nProvider', function(i18nProvider){
    i18nProvider.addResource('uikit/mw-list/i18n');
  }]);

/**
 * Created by zarges on 23/02/16.
 */
angular.module('mwUI.Menu', []);

window.mwUI.Menu = {};

/**
 * Created by zarges on 15/02/16.
 */
var routeToRegex = mwUI.Utils.shims.routeToRegExp;

var MwMenuEntry = window.mwUI.Backbone.NestedModel.extend({
  idAttribute: 'id',
  defaults: function(){
    return {
      url: null,
      label: null,
      icon: null,
      activeUrls: [],
      order: null
    };
  },
  nested: function(){
    return {
      subEntries: window.mwUI.Menu.MwMenuSubEntries
    };
  },
  _throwMissingIdError: function(entry){
    throw new Error('No id is specified for the entry', entry);
  },
  _throwNoTypeCouldBeDeterminedError: function(entry){
    throw new Error('No type could be determinded for the given entry: ',entry);
  },
  _throwNotValidEntryError: function(entry){
    throw new Error('Is not a valid entry', entry);
  },
  _determineType: function(entry){
    if(!entry.type){
      if(!entry.url && (!entry.subEntries || entry.subEntries.length===0) && !(entry.label || entry.icon)){
        entry.type='DIVIDER';
      } else if(entry.url || entry.subEntries && entry.subEntries.length>0 && (entry.label || entry.icon)){
        entry.type='ENTRY';
      } else {
        this._throwNoTypeCouldBeDeterminedError();
      }
    }

    return entry;
  },
  _missingUrl: function(entry){
    return entry.type === 'ENTRY' && !entry.url && (!entry.subEntries || entry.subEntries.length === 0);
  },
  _missingLabel: function(entry){
    return entry.type === 'ENTRY' && !entry.label && !entry.icon;
  },
  isValidEntry: function(entry){
    if(entry.type){
      return !this._missingUrl(entry) && !this._missingLabel(entry);
    } else {
      return false;
    }
  },
  ownUrlIsActiveForUrl: function(url){
    if(this.get('url')){
      return url.match(routeToRegex(this.get('url')));
    } else {
      return false;
    }
  },
  activeUrlIsActiveForUrl: function(url){
    var isActive = false;
    this.get('activeUrls').forEach(function(activeUrl){
      if(!isActive){
        isActive = url.match(routeToRegex(activeUrl));
      }
    });
    return isActive;
  },
  isActiveForUrl: function(url){
    return this.ownUrlIsActiveForUrl(url) || this.activeUrlIsActiveForUrl(url);
  },
  getActiveSubEntryForUrl: function(url){
    return this.get('subEntries').getActiveEntryForUrl(url);
  },
  hasActiveSubEntryOrIsActiveForUrl: function(url){
    return this.get('type') === 'ENTRY' && (!!this.getActiveSubEntryForUrl(url) || this.isActiveForUrl(url));
  },
  constructor: function(entry, options){
    entry = this._determineType(entry);
    if(!entry.id){
      this._throwMissingIdError();
    }
    if(!this.isValidEntry(entry)){
      this._throwNotValidEntryError();
    }
    return window.mwUI.Backbone.NestedModel.prototype.constructor.call(this, entry, options);
  }
});

window.mwUI.Menu.MwMenuEntry = MwMenuEntry;

/**
 * Created by zarges on 15/02/16.
 */
var MwMenuEntries = Backbone.Collection.extend({
  model: window.mwUI.Menu.MwMenuEntry,
  comparator: 'order',
  _isAlreadyRegistered: function(entry) {
    return (
      this.get(entry.id) ||
      (entry.url && this.findWhere({url: entry.url}))
    );
  },
  _throwIsAlreadyRegisteredError: function(entry){
    if(entry.url){
      throw new Error('The entry with the id ' + entry.id + ' and the url ' + entry.url + ' has already been registered');
    } else {
      throw new Error('The entry with the id ' + entry.id + ' has already been registered');
    }
  },
  add: function(entries){
    if(_.isArray(entries)){
      entries.forEach(function(entry){
        if(this._isAlreadyRegistered(entry)){
          this._throwIsAlreadyRegisteredError(entry);
        }
      }.bind(this));
    } else {
      if(this._isAlreadyRegistered(entries)){
        this._throwIsAlreadyRegisteredError(entries);
      }
    }
    return Backbone.Collection.prototype.add.apply(this, arguments);
  },
  addEntry: function(id, url, label, options){
    options = options || {};
    var addObj = {
      id: id,
      url: url,
      label: label,
      icon: options.icon,
      activeUrls: options.activeUrls || [],
      order: options.order,
      subEntries: options.subEntries || [],
      type: 'ENTRY'
    };

    return this.add(addObj);
  },
  addDivider: function(id, options){
    options = options || {};
    var addObj = {
      id: id,
      label: options.label,
      order: options.order,
      type: 'DIVIDER'
    };

    return this.add(addObj);
  },

  getActiveEntryForUrl: function(url){
    var activeEntryFound = false,
        activeEntry = null;

    this.each(function(model){
      if(!activeEntryFound && model.hasActiveSubEntryOrIsActiveForUrl(url)){
        activeEntryFound = true;
        activeEntry = model;
      }
    });

    return activeEntry;
  }
});

window.mwUI.Menu.MwMenuEntries = MwMenuEntries;
/**
 * Created by zarges on 15/02/16.
 */
var MwMenuSubEntries = window.mwUI.Menu.MwMenuEntries.extend({});

window.mwUI.Menu.MwMenuSubEntries = MwMenuSubEntries;
/**
 * Created by zarges on 15/02/16.
 */
var MwMenu = window.mwUI.Menu.MwMenuEntries.extend({});

window.mwUI.Menu.MwMenu = MwMenu;

/**
 * Created by zarges on 23/02/16.
 */
angular.module('mwUI.Menu', [])

  .provider('mwSidebarMenu', function () {

    var mwMenu = new mwUI.Menu.MwMenu(),
        logoUrl;

    this.getMenu = function () {
      return mwMenu;
    };

    this.setLogoUrl = function(url){
      logoUrl = url;
    };

    this.getLogoUrl = function(){
      return logoUrl;
    };

    this.$get = function () {
      return this;
    };

  });

/**
 * Created by zarges on 23/02/16.
 */
angular.module('mwUI.Menu')

  .directive('mwMenu', function () {
    return {
      scope: {
        menu: '=mwMenu'
      },
      templateUrl: 'uikit/mw-menu/directives/templates/mw_menu.html'
    };
  });
/**
 * Created by zarges on 23/02/16.
 */
angular.module('mwUI.Menu')

  .directive('mwMenuEntry', function () {
    return {
      scope: {},
      bindToController: {
        entry: '=mwMenuEntry'
      },
      templateUrl: 'uikit/mw-menu/directives/templates/mw_menu_entry.html',
      controllerAs: 'menuEntryCtrl',
      controller: ['$rootScope', '$location', function($rootScope, $location){
        this.isActive = this.entry.isActiveForUrl($location.url());

        $rootScope.$on('$locationChangeSuccess', function () {
          this.isActive = this.entry.hasActiveSubEntryOrIsActiveForUrl($location.url());
        }.bind(this));
      }]
    };
  });
/**
 * Created by zarges on 23/02/16.
 */
angular.module('mwUI.Menu')

  .directive('mwMenuSubEntry', function () {
    return {
      scope: {},
      bindToController: {
        entry: '=mwMenuSubEntry'
      },
      templateUrl: 'uikit/mw-menu/directives/templates/mw_menu_sub_entry.html',
      controllerAs: 'menuSubEntryCtrl',
      controller: ['$rootScope', '$location', function($rootScope, $location){
        this.isActive = this.entry.isActiveForUrl($location.url());

        $rootScope.$on('$locationChangeSuccess', function () {
          this.isActive = this.entry.hasActiveSubEntryOrIsActiveForUrl($location.url());
        }.bind(this));
      }]
    };
  });
/**
 * Created by zarges on 23/02/16.
 */
angular.module('mwUI.Menu')

  .directive('mwSidebarMenu', ['mwSidebarMenu', function (mwSidebarMenu) {
    return {
      templateUrl: 'uikit/mw-menu/directives/templates/mw_sidebar_menu.html',
      transclude: true,
      controllerAs: 'ctrl',
      controller: function(){
        var isOpened = false;
        this.mwMenu = mwSidebarMenu.getMenu();
        this.mwMenuLogo = mwSidebarMenu.getLogoUrl();

        this.isOpened = function(){
          return isOpened;
        };

        this.toggleState = function(){
          isOpened = !isOpened;
        };
      }
    };
  }]);
angular.module('mwUI.Modal', ['mwUI.i18n']);

angular.module('mwUI.Modal')

  .directive('mwModal', ['mwModalTmpl', function (mwModalTmpl) {
    return {
      restrict: 'A',
      scope: {
        title: '@'
      },
      transclude: true,
      templateUrl: 'uikit/mw-modal/directives/templates/mw_modal.html',
      link: function (scope) {
        scope.$emit('COMPILE:FINISHED');
        scope.mwModalTmpl = mwModalTmpl;
      }
    };
  }]);
angular.module('mwUI.Modal')

  .directive('mwModalBody', function () {
    return {
      transclude: true,
      templateUrl: 'uikit/mw-modal/directives/templates/mw_modal_body.html'
    };
  });
angular.module('mwUI.Modal')

  .directive('mwModalConfirm', function () {
    return {
      restrict: 'A',
      transclude: true,
      scope: true,
      templateUrl: 'uikit/mw-modal/directives/templates/mw_modal_confirm.html',
      link: function (scope, elm, attr) {
        angular.forEach(['ok', 'cancel'], function (action) {
          scope[action] = function () {
            scope.$eval(attr[action]);
          };
        });
      }
    };
  });
angular.module('mwUI.Modal')

  .directive('mwModalFooter', function () {
    return {
      transclude: true,
      templateUrl: 'uikit/mw-modal/directives/templates/mw_modal_footer.html'
    };
  });

angular.module('mwUI.Modal')

  .service('Modal', ['$rootScope', '$templateCache', '$document', '$compile', '$controller', '$q', '$templateRequest', '$timeout', 'Toast', function ($rootScope, $templateCache, $document, $compile, $controller, $q, $templateRequest, $timeout, Toast) {

    var _openedModals = [];

    var Modal = function (modalOptions, bootStrapModalOptions) {

      var _id = modalOptions.templateUrl,
        _scope = modalOptions.scope || $rootScope,
        _scopeAttributes = modalOptions.scopeAttributes || {},
        _controller = modalOptions.controller,
        _class = modalOptions.class || '',
        _holderEl = modalOptions.el ? modalOptions.el : 'body .module-page',
        _bootStrapModalOptions = bootStrapModalOptions || {},
        _modalOpened = false,
        _self = this,
        _modal,
        _usedScope,
        _bootstrapModal,
        _previousFocusedEl;

      var _getTemplate = function () {
        if (!_id) {
          throw new Error('Modal service: templateUrl options is required.');
        }
        return $templateRequest(_id);
      };

      var _bindModalCloseEvent = function () {
        _bootstrapModal.on('hidden.bs.modal', function () {
          _self.destroy();
        });
      };

      var _destroyOnRouteChange = function () {
        var changeLocationOff = $rootScope.$on('$locationChangeStart', function (ev, newUrl) {
          if (_bootstrapModal && _modalOpened) {
            ev.preventDefault();
            _self.hide().then(function () {
              document.location.href = newUrl;
              changeLocationOff();
            });
          } else {
            changeLocationOff();
          }
        });
      };

      var _buildModal = function () {
        var dfd = $q.defer();

        _usedScope = _scope.$new();

        _.extend(_usedScope, _scopeAttributes);

        if (_controller) {
          $controller(_controller, {$scope: _usedScope, modalId: _id});
        }

        _scope.hideModal = function () {
          return _self.hide();
        };

        _getTemplate().then(function (template) {
          _modal = $compile(template.trim())(_usedScope);
          _usedScope.$on('COMPILE:FINISHED', function () {
            _modal.addClass('mw-modal');
            _modal.addClass(_class);
            _bootstrapModal = _modal.find('.modal');
            _bootStrapModalOptions.show = false;
            _bootstrapModal.modal(_bootStrapModalOptions);

            // We need to overwrite the the original backdrop method with our own one
            // to make it possible to define the element where the backdrop should be placed
            // This enables us a backdrop per modal because we are appending the backdrop to the modal
            // When opening multiple modals the previous will be covered by the backdrop of the latest opened modal
            /* jshint ignore:start */
            if (_bootstrapModal.data()) {
              var bootstrapModal = _bootstrapModal.data()['bs.modal'],
                $bootstrapBackdrop = bootstrapModal.backdrop;

              bootstrapModal.backdrop = function (callback) {
                $bootstrapBackdrop.call(bootstrapModal, callback, $(_holderEl).find('.modal'));
              };
            }
            /* jshint ignore:end */

            _bindModalCloseEvent();
            _destroyOnRouteChange();
            dfd.resolve();
          });
        });

        return dfd.promise;
      };

      this.id = _id;

      this.getScope = function () {
        return _scope;
      };

      /**
       *
       * @ngdoc function
       * @name mwModal.Modal#show
       * @methodOf mwModal.Modal
       * @function
       * @description Shows the modal
       */
      this.show = function () {
        Toast.clear();
        _previousFocusedEl = angular.element(document.activeElement);

        _buildModal().then(function () {
          angular.element(_holderEl).append(_modal);
          _bootstrapModal.modal('show');
          _modalOpened = true;
          _openedModals.push(this);
          _bootstrapModal.on('shown.bs.modal', function () {
            angular.element(this).find('input:text:visible:first').focus();
          });
          if (_previousFocusedEl) {
            _bootstrapModal.on('hidden.bs.modal', function () {
              _previousFocusedEl.focus();
            });
          }

        }.bind(this));
      };


      this.setScopeAttributes = function (obj) {
        if (_.isObject(obj)) {
          _.extend(_scopeAttributes, obj);
        }
      };

      /**
       *
       * @ngdoc function
       * @name mwModal.Modal#hide
       * @methodOf mwModal.Modal
       * @function
       * @description Hides the modal
       * @returns {Object} Promise which will be resolved when modal is successfully closed
       */
      this.hide = function () {
        var dfd = $q.defer();


        if (_bootstrapModal && _modalOpened) {
          _bootstrapModal.one('hidden.bs.modal', function () {
            _bootstrapModal.off();
            _self.destroy();
            _modalOpened = false;
            dfd.resolve();
          });
          _bootstrapModal.modal('hide');
        } else {
          dfd.resolve();
        }

        return dfd.promise;
      };

      /**
       *
       * @ngdoc function
       * @name mwModal.Modal#toggle
       * @methodOf mwModal.Modal
       * @function
       * @description Toggles the modal
       * @param {String} modalId Modal identifier
       */
      this.toggle = function () {
        _bootstrapModal.modal('toggle');
      };

      /**
       *
       * @ngdoc function
       * @name mwModal.Modal#destroy
       * @methodOf mwModal.Modal
       * @function
       * @description Removes the modal from the dom
       */
      this.destroy = function () {
        _openedModals = _.without(_openedModals, this);
        var toasts = Toast.getToasts();
        toasts.forEach(function (toast) {
          if (+new Date() - toast.initDate > 500) {
            Toast.removeToast(toast.id);
          }
        });

        $timeout(function () {
          if (_modal) {
            _modal.remove();
            _modalOpened = false;
          }

          if (_usedScope) {
            _usedScope.$destroy();
          }
        }.bind(this));
      };

      (function main() {

        _getTemplate();

        _scope.$on('$destroy', function () {
          _self.hide();
        });

      })();

    };

    /**
     *
     * @ngdoc function
     * @name mwModal.Modal#create
     * @methodOf mwModal.Modal
     * @function
     * @description Create and initialize the modal element in the DOM. Available options
     *
     * - **templateUrl**: URL to a template (_required_)
     * - **scope**: scope that should be available in the controller
     * - **controller**: controller instance for the modal
     *
     * @param {Object} modalOptions The options of the modal which are used to instantiate it
     * @returns {Object} Modal
     */
    this.create = function (modalOptions) {
      return new Modal(modalOptions);
    };

    this.prepare = function (modalOptions, bootstrapModalOptions) {
      var ModalDefinition = function () {
        return new Modal(modalOptions, bootstrapModalOptions);
      };
      return ModalDefinition;
    };

    this.getOpenedModals = function () {
      return _openedModals;
    };
  }]);

angular.module('mwUI.Modal')

  .provider('mwModalTmpl', function () {

    var _logoPath;

    this.setLogoPath = function (path) {
      _logoPath = path;
    };

    this.$get = function () {
      return {
        getLogoPath: function () {
          return _logoPath;
        }
      };
    };
  });

/* jshint ignore:start */
// This is the orginal bootstrap backdrop implementation with the only
// modification that the element can be defined as parameter where the backdrop should be placed
$.fn.modal.Constructor.prototype.backdrop = function (callback, holderEl) {
  var animate = this.$element.hasClass('fade') ? 'fade' : '';

  if (this.isShown && this.options.backdrop) {
    var doAnimate = $.support.transition && animate;

    this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
      .appendTo(holderEl);

    this.$backdrop.on('click', $.proxy(function (e) {
      if (e.target !== e.currentTarget) {
        return;
      }
      this.options.backdrop == 'static'
        ? this.$element[0].focus.call(this.$element[0])
        : this.hide.call(this)
    }, this));

    if (doAnimate) {
      this.$backdrop[0].offsetWidth;
    } // force reflow

    this.$backdrop.addClass('in');

    if (!callback) return;

    doAnimate ?
      this.$backdrop
        .one($.support.transition.end, callback)
        .emulateTransitionEnd(150) :
      callback()

  } else if (!this.isShown && this.$backdrop) {
    this.$backdrop.removeClass('in');

    $.support.transition && this.$element.hasClass('fade') ?
      this.$backdrop
        .one($.support.transition.end, callback)
        .emulateTransitionEnd(150) :
      callback()

  } else if (callback) {
    callback()
  }
};
/* jshint ignore:end */

angular.module('mwUI.Modal')

  .config(['i18nProvider', function(i18nProvider){
    i18nProvider.addResource('uikit/mw-modal/i18n');
  }]);
angular.module('mwUI.ResponseToastHandler', ['mwUI.Toast','mwUI.ResponseHandler', 'mwUI.i18n', 'mwUI.Utils']);

angular.module('mwUI.ResponseToastHandler')

  .provider('ResponseToastHandler', ['$provide', 'ResponseHandlerProvider', function ($provide, ResponseHandlerProvider) {
    var _registeredIds = [],
      _registeredToastOptions = {
        DEFAULT: {
          type: 'default',
          autoHide: false
        }
      };

    var _getNotificationCallback = function (messages, id, options) {
      options = options || {};
      var factoryName = _.uniqueId('notification_factory');
      $provide.factory(factoryName, ['Toast', 'i18n', 'callbackHandler', function (Toast, i18n, callbackHandler) {
        return function ($httpResponse) {
          if(!messages){
            return;
          }

          var prevToast = Toast.findToast(id),
            data = {},
            messageStr = prevToast ? messages.plural : messages.singular,
            message,
            toastOptions = {
              id: id
            };

          if (!!prevToast && messages.plural) {
            messageStr = messages.plural;
          } else if (messages.singular) {
            messageStr = messages.singular;
          }

          data.$count = prevToast ? prevToast.replaceCount + 1 : 0;
          data.$count++;

          data.$httpStatusCode = $httpResponse.status;

          if (options.preProcess) {
            _.extend(data, $httpResponse.data);

            message = callbackHandler.exec(options.preProcess, [messageStr, data, i18n, $httpResponse], this);
            if(!message){
              return;
            }
          } else {
            var resp = $httpResponse.data || {};

            if (resp.results && !_.isObject(resp.results)) {
              data = {message: resp.results};
            } else if (resp.results && resp.results.length > 0) {
              _.extend(data, resp.results[0]);
            }

            if ($httpResponse.config.instance && typeof $httpResponse.config.instance.toJSON === 'function') {
              var json = $httpResponse.config.instance.toJSON();
              _.extend(json, data);
              data = json;
            }

            message = i18n.get(messageStr, data);
          }

          if (options.toastType) {
            var opts = _registeredToastOptions[options.toastType];
            if (opts) {
              _.extend(toastOptions, opts);
            } else {
              throw new Error('Type ' + options.toastType + ' is not available. Make sure you have configured it first');
            }
          } else {
            _.extend(toastOptions, _registeredToastOptions.DEFAULT);
          }

          Toast.addToast(message, toastOptions);
        };
      }]);
      return factoryName;
    };

    this.registerToastType = function (typeId, toastOptions) {
      if (_registeredToastOptions[typeId]) {
        throw new Error('The toast type ' + typeId + ' is already defined. You can configure a toast type only once');
      } else {
        _registeredToastOptions[typeId] = toastOptions;
      }
    };

    this.registerToast = function (route, messages, options) {
      options = options || {};
      var codes = options.statusCodes || [options.onSuccess ? 'SUCCESS' : 'ERROR'];

      if (_.isUndefined(messages) || _.isObject(messages) && !messages.singular) {
        throw new Error('You have to pass a messages object and define at least the singular message {singular:"Mandatory", plural:"Optional"}');
      }

      codes.forEach(function (code) {
        var msgId = options.id || route + '_' + options.method + '_' + code,
          callbackFactory = _getNotificationCallback(messages, msgId, options);

        if (_registeredIds.indexOf(msgId) > -1) {
          throw new Error('You can not define a second message for the route ' + route + ' and method ' + options.method + ' because you have already registered one!');
        } else {
          if(code==='SUCCESS' || code ==='ERROR'){
            delete options.statusCodes;
          } else {
            options.statusCodes = [code];
          }
          ResponseHandlerProvider.registerAction(route, callbackFactory, options);
          _registeredIds.push(msgId);
        }
      });

    };

    this.registerSuccessToast = function (route, messages, method, toastType, preProcessFn) {
      this.registerToast(route, messages, {
        method: method,
        toastType: toastType,
        onSuccess: true,
        preProcess: preProcessFn
      });
    };

    this.registerErrorToast = function (route, messages, method, toastType, preProcessFn) {
      this.registerToast(route, messages, {
        method: method,
        toastType: toastType,
        onError: true,
        preProcess: preProcessFn
      });
    };

    this.registerDefaultSuccessToast = function (messages, method, toastType, preProcessFn) {
      return this.registerToast('*', messages, {
        method: method,
        toastType: toastType,
        onSuccess: true,
        preProcess: preProcessFn
      });
    };

    this.registerDefaultErrorToast = function (messages, method, toastType, preProcessFn) {
      return this.registerToast('*', messages, {
        method: method,
        toastType: toastType,
        onError: true,
        preProcess: preProcessFn
      });
    };

    this.$get = function () {};

  }]);
angular.module('mwUI.ResponseHandler', ['mwUI.Utils']);

angular.module('mwUI.ResponseHandler')

  .provider('ResponseHandler', function () {

    var _routeHandlersPerMethodContainer = {
      POST: [],
      PUT: [],
      GET: [],
      DELETE: [],
      PATCH: []
    };

    var _methodIsInValidError = function(method){
      return new Error('Method '+method+' is invalid. Valid methods are POST, PUT, GET, DELETE, PATCH');
    };

    var _routeToRegex = mwUI.Utils.shims.routeToRegExp;

    var RouteHandler = function (route) {

      var _codes = {
          ERROR: [],
          SUCCESS: []
        },
        _route = route,
        _routeRegex = null;

      var _registerCallbackForCode = function (code, callback) {

        var existingCallbacks = _codes[code],
          callbacks = existingCallbacks || [];

        callbacks.push(callback);

        _codes[code] = callbacks;
      };

      var _getCallbackForCode = function (code) {
        return _codes[code];
      };

      this.matchesUrl = function (url) {
        return url.match(_routeRegex);
      };

      this.registerCallbackForStatusCodes = function (statusCodes, callback) {
        statusCodes.forEach(function (statusCode) {
          _registerCallbackForCode(statusCode, callback);
        }, this);
      };

      this.registerCallbackForSuccess = function (callback) {
        _registerCallbackForCode('SUCCESS', callback);
      };

      this.registerCallbackForError = function (callback) {
        _registerCallbackForCode('ERROR', callback);
      };

      this.getCallbacksForStatusCode = function (statusCode) {
        return _getCallbackForCode(statusCode);
      };

      this.getCallbacksForSuccess = function () {
        return _getCallbackForCode('SUCCESS');
      };

      this.getCallbacksForError = function () {
        return _getCallbackForCode('ERROR');
      };

      var main = function () {
        _routeRegex = _routeToRegex(_route);
      };

      main.call(this);
    };

    this.registerAction = function (route, callback, options) {
      options = options || {};

      if(!options.onError && !options.onSuccess && !options.statusCodes){
        throw new Error('You have to specify either some statusCodes or set onSuccess or onError to true in the options parameter object');
      }

      if (( options.onError && options.onSuccess ) || ( (options.onError || options.onSuccess) && options.statusCodes )) {
        throw new Error('Definition is too imprecise');
      }
      if (!options.method && !options.methods) {
        throw new Error('Method has to be defined in options e.g method: "POST" or methods:["POST"]');
      }

      options.methods = options.methods || [options.method];

      options.methods.forEach(function(method){

        if (!_routeHandlersPerMethodContainer[method]) {
          throw _methodIsInValidError(method);
        }

        var existingRouteHandlerContainer = _.findWhere(_routeHandlersPerMethodContainer[method], {id: route}),
          routeHandlerContainer = existingRouteHandlerContainer || {id: route, handler: new RouteHandler(route)},
          routeHandler = routeHandlerContainer.handler;

        if (options.statusCodes) {
          routeHandler.registerCallbackForStatusCodes(options.statusCodes, callback);
        } else if (options.onSuccess) {
          routeHandler.registerCallbackForSuccess(callback);
        } else if (options.onError) {
          routeHandler.registerCallbackForError(callback);
        }

        if (!existingRouteHandlerContainer) {
          _routeHandlersPerMethodContainer[method].push(routeHandlerContainer);
        }

      });
    };

    this.registerSuccessAction = function (route, callback, method) {
      return this.registerAction(route, callback, {
        method: method,
        onSuccess: true
      });
    };

    this.registerErrorAction = function (route, callback, method) {
      return this.registerAction(route, callback, {
        method: method,
        onError: true
      });
    };

    this.registerDefaultAction = function(callback, options){
      options = options || {};
      return this.registerAction('*', callback, options);
    };

    this.registerDefaultSuccessAction = function (callback, method) {
      return this.registerAction('*', callback, {
        method: method,
        onSuccess: true
      });
    };

    this.registerDefaultErrorAction = function (callback, method) {
      return this.registerAction('*', callback, {
        method: method,
        onError: true
      });
    };

    this.$get = ['$injector', '$q', 'callbackHandler', function ($injector, $q, callbackHandler) {

      /*
       *  Execute promises sequentially
       *  When funtion does not return a promise it converts the response into a promise
       *  The last function defines if the chain should be resolved or rejected by rejecting or resolving value
       *  When the first function rejectes value but the last function resolves it the whole chain will be resolved
       */
      var _executePromiseQueue = function(fns, resp, isError, dfd){
        var fn = fns.shift();

        if(!dfd){
          dfd = $q.defer();
        }

        if(fn){
          var returnVal = fn(resp, isError),
            promise;
          if(returnVal && returnVal.then){
            promise = returnVal;
          } else {
            if(isError){
              promise = $q.reject(returnVal || resp);
            } else {
              promise = $q.when(returnVal || resp);
            }
          }

          promise.then(function(rsp){
            _executePromiseQueue(fns, rsp, false, dfd);
          },function(rsp){
            _executePromiseQueue(fns, rsp, true, dfd);
          });
        } else {
          if(isError){
            dfd.reject(resp);
          } else {
            dfd.resolve(resp);
          }
        }
        return dfd.promise;
      };

      var _executeCallbacks = function (callbacks, response, isError) {
        var fns = [];
        callbacks.forEach(function (callback) {
          if(callback){
            callback = callbackHandler.getFn(callback);
            fns.push(callback);
          }
        }, this);
        return _executePromiseQueue(fns, response, isError);
      };

      var _getCallbacks = function(handler, statusCode, isError){
        var statusCallbacks = handler.getCallbacksForStatusCode(statusCode),
          successCallbacks = handler.getCallbacksForSuccess(),
          errorCallbacks = handler.getCallbacksForError();

        if(statusCallbacks){
          return statusCallbacks;
        } else if(isError){
          return errorCallbacks;
        } else {
          return successCallbacks;
        }
      };

      return {
        getHandlerForUrlAndCode: function (method, url, statusCode, isError) {
          var _returnHandler;

          if (!_routeHandlersPerMethodContainer[method]) {
            throw _methodIsInValidError(method);
          }

          _routeHandlersPerMethodContainer[method].forEach(function (routeHandlerContainer) {
            var handler = routeHandlerContainer.handler,
              callbacks = _getCallbacks(handler, statusCode, isError);
            if (!_returnHandler && handler.matchesUrl(url) && callbacks && callbacks.length>0) {
              _returnHandler = handler;
            }
          });

          return _returnHandler;
        },
        handle: function (response, isError) {
          var url = response.config.url,
            method = response.config.method,
            statusCode = response.status,
            handler = this.getHandlerForUrlAndCode(method, url, statusCode, isError);

          if (handler) {
            var callbacks = _getCallbacks(handler, statusCode, isError);
            if(callbacks){
              return _executeCallbacks(callbacks, response, isError);
            }
          }
        }
      };
    }];
  });



angular.module('mwUI.ResponseHandler')

  .config(['$provide', '$httpProvider', function ($provide, $httpProvider) {

    $provide.factory('requestInterceptorForHandling', ['$q', 'ResponseHandler', function ($q, ResponseHandler) {

      var handle = function(response, isError){
        var handler = ResponseHandler.handle(response, isError);
        if(handler){
          return handler;
        } else if(isError){
          return $q.reject(response);
        } else {
          return $q.when(response);
        }
      };

      return {
        response: function (response) {
          return handle(response, false);
        },
        responseError: function (response) {
          return handle(response, true);
        }
      };
    }]);

    $httpProvider.interceptors.push('requestInterceptorForHandling');

  }]);


angular.module('mwUI.Toast', []);

'use strict';

angular.module('mwUI.Toast')

  .provider('Toast', function () {

    var _autoHideTime = 5000,
      _toasts = [],
      _defaultIcons = {
        primary: 'fa-flag-o',
        info: 'fa-info',
        success: 'fa-check',
        warning: 'fa-warning',
        danger: 'fa-exclamation'
      };

    var Toast = function (message, options) {
      options = options || {};
      options.button = options.button || {};

      var toast = {
          id: options.id || _.uniqueId('toast'),
          type: options.type || 'default',
          visible: true,
          message: message,
          title: options.title,
          autoHide: options.autoHide || false,
          autoHideTime: options.autoHideTime || 5000,
          autoHideCallback: options.autoHideCallback,
          isHtmlMessage: options.isHtmlMessage,
          icon: options.icon || _defaultIcons[options.type] || 'fa-info',
          button: {
            title: options.button.title,
            link: options.button.link,
            target: options.button.target,
            isLink: options.button.isLink || !!options.button.link,
            action: options.button.action
          },
          replaceCount: 0,
          initDate: +new Date()
        },
        _autoRemoveTimeout;

      var startAutoHideTimer = function () {
        if (toast.autoHide) {
          _autoRemoveTimeout = window.setTimeout(function () {
            if (toast.autoHideCallback && typeof toast.autoHideCallback === 'function') {
              toast.visible = false;
              toast.autoHideCallback.apply(this, arguments);
            }
          }.bind(this), toast.autoHideTime);
        }
      };

      var resetAutoHideTimer = function () {
        if (_autoRemoveTimeout) {
          window.clearTimeout(_autoRemoveTimeout);
        }
        startAutoHideTimer();
      };

      var setAutoHideCallback = function (fn) {
        toast.autoHideCallback = fn;
        resetAutoHideTimer();
      };

      var replaceMessage = function (newMessage) {
        toast.message = newMessage;
        toast.replaceCount++;
        resetAutoHideTimer();
      };

      toast.replaceMessage = replaceMessage;
      toast.setAutoHideCallback = setAutoHideCallback;


      startAutoHideTimer();

      return toast;
    };

    this.setAutoHideTime = function (timeInMs) {
      _autoHideTime = timeInMs;
    };

    this.setDefaultIcons = function(obj){
      _.extend(_defaultIcons,obj);
    };

    this.$get = ['$timeout', function ($timeout) {

      return {
        findToast: function (id) {
          var toastContainer = _.findWhere(_toasts, {id: id});
          if (toastContainer) {
            return toastContainer.toast;
          } else {
            return false;
          }
        },
        clear: function () {
          _toasts = [];
        },
        getToasts: function () {
          return _.pluck(_toasts, 'toast');
        },
        replaceToastMessage: function (id, message) {

          var toast = this.findToast(id);

          if (toast) {
            toast.replaceMessage(message);
          }

          return toast;
        },
        removeToast: function (id) {
          var match = _.findWhere(_toasts, {id: id}),
            index = _.indexOf(_toasts, match);

          if (match) {
            _toasts.splice(index, 1);
          }

          return match;
        },
        addToast: function (message, options) {
          options = options || {};

          options.autoHideTime = options.autoHideTime || _autoHideTime;

          var existingToast = this.findToast(options.id);

          if (existingToast) {
            this.replaceToastMessage(existingToast.id, message);
          } else {
            var toast = new Toast(message, options);

            var removeFn = function () {
              $timeout(function () {
                if (options.autoHideCallback && typeof options.autoHideCallback === 'function') {
                  options.autoHideCallback.apply(this, arguments);
                }
                this.removeToast(toast.id);
              }.bind(this));
            }.bind(this);

            toast.setAutoHideCallback(removeFn);

            _toasts.push({id: toast.id, toast: toast});

            return toast;
          }
        }
      };
    }];
  });


'use strict';

angular.module('mwUI.Toast')

  .directive('mwToasts', ['Toast', function (Toast) {
    return {
      templateUrl: 'uikit/mw-toast/directives/templates/mw_toasts.html',
      link: function (scope) {
        scope.toasts = Toast.getToasts();

        scope.$watch(function () {
          return Toast.getToasts().length;
        }, function () {
          scope.toasts = Toast.getToasts();
        });

        scope.hideToast = function (toastId) {
          Toast.removeToast(toastId);
        };
      }
    };
  }]);

angular.module('mwUI.UiComponents', ['mwUI.i18n','mwUI.Utils']);

angular.module('mwUI.UiComponents')

  .directive('mwAlert', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        type: '@mwAlert'
      },
      transclude: true,
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_alert.html'
    };
  });
angular.module('mwUI.UiComponents')

  //Todo rename
  .directive('mwLinkShow', function () {
    return {
      restrict: 'A',
      scope: {
        link: '@mwLinkShow'
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_arrow_link.html'
    };
  });

angular.module('mwUI.UiComponents')
  //TODO remove this or add functionality to make it useful
  .directive('mwBadge', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: {mwBadge: '@'},
      transclude: true,
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_badge.html'
    };
  });
angular.module('mwUI.UiComponents')

  .directive('mwBreadCrumb', function () {
    return {
      scope: {
        url: '@',
        title: '@'
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_bread_crumb.html'
    };
  });
angular.module('mwUI.UiComponents')

  .directive('mwBreadCrumbsHolder', function () {
    return {
      transclude: true,
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_bread_crumbs_holder.html'
    };
  });
angular.module('mwUI.UiComponents')

  .directive('mwButtonHelp', ['i18n', '$compile', function (i18n, $compile) {
    return {
      restrict: 'A',
      scope: true,
      link: function (scope, elm) {
        var popup;
        var helpIcon =
          $compile(angular.element('<div mw-icon="mwUI.question">'))(scope)
          .addClass('help-icon hidden-sm hidden-xs');

        elm.addClass('mw-button-help');
        elm.prepend(helpIcon);

        var buildPopup = function () {
          popup = angular.element('<div>' + scope.helpText + '<ul></ul></div>').addClass('mw-button-help-popover popover');
          angular.forEach(scope.hintsToShow, function (hint) {
            popup.find('ul').append('<li>' + hint.text + '</li>');
          });
        };

        helpIcon.hover(function () {
          buildPopup();
          var targetOffset = angular.element(this).offset();
          angular.element('body').append(popup);
          popup.css('top', targetOffset.top - (popup.height() / 2) + 10 - angular.element(document).scrollTop());
          popup.css('left', (targetOffset.left + 40));
        }, function () {
          angular.element('body > .mw-button-help-popover').remove();
        });

        scope.$watch('hintsToShow', function (newVal) {
          if (newVal && newVal.length) {
            helpIcon.removeClass('hidden');
          } else {
            helpIcon.addClass('hidden');
          }
        });

        scope.$on('$destroy', function () {
          if (popup) {
            popup.remove();
          }
        });
      },
      controller: ['$scope', function ($scope) {
        $scope.registeredHints = [];
        $scope.hintsToShow = [];
        $scope.helpText = i18n.get('UiComponents.mwButtonHelp.isDisabledBecause');
        $scope.$on('i18n:localeChanged', function () {
          $scope.helpText = i18n.get('common.buttonHelp');
        });

        var showHelp = function () {
          $scope.hintsToShow = [];
          angular.forEach($scope.registeredHints, function (registered) {
            if (registered.condition) {
              $scope.hintsToShow.push(registered);
            }
          });
        };

        //check if any condition changes
        this.register = function (registered) {
          $scope.$watch(function () {
            return registered.condition;
          }, showHelp);
          $scope.registeredHints.push(registered);
        };


      }]
    };
  }]);

angular.module('mwUI.UiComponents')

  .directive('mwButtonHelpCondition', function () {
    return {
      restrict: 'A',
      require: '^mwButtonHelp',
      scope: {
        condition: '=mwButtonHelpCondition',
        text: '@mwButtonHelpText'
      },
      link: function (scope, elm, attr, ctrl) {
        ctrl.register(scope);
      }
    };
  });

angular.module('mwUI.UiComponents')

  //TODO rename to mwCollapsible
  .directive('mwCollapsable', function () {
    return {
      transclude: true,
      scope: {
        mwCollapsable: '=',
        title: '@mwTitle'
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_collapsible.html',
      link: function (scope) {
        scope.viewModel = {};
        scope.viewModel.collapsed = false;

        scope.toggle = function () {
          scope.viewModel.collapsed = !scope.viewModel.collapsed;
        };

        if (scope.mwCollapsable === false) {
          scope.viewModel.collapsed = true;
        }
      }
    };
  });
angular.module('mwUI.UiComponents')

  .directive('mwIndefiniteLoading', function () {
    return {
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_indefinite_loading.html'
    };
  });
angular.module('mwUI.UiComponents')

  .directive('mwIcon', ['mwIcon', function (mwIcon) {
    return {
      scope: {
        icon: '@mwIcon',
        tooltip: '@'
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_icon.html',
      link: function (scope) {
        scope.viewModel = {
          icon: null,
          iconSet: null,
          oldIcon: null
        };

        var setIconOld = function(iconStr){
          var isFontAwesome = iconStr.match(/^fa-/),
            isRlnIcon = iconStr.match(/rln-icon/);

          if (isFontAwesome) {
            scope.viewModel.oldIcon = 'fa ' + iconStr;
          } else if (isRlnIcon) {
            scope.viewModel.oldIcon = 'rln-icon ' + iconStr;
          } else {
            scope.viewModel.oldIcon = 'glyphicon glyphicon-' + iconStr;
          }
        };

        var setViewIcon = function(key){
          scope.viewModel.iconSet.getIconForKey(key).then(function(icon){
            scope.viewModel.icon = icon;
          });
        };

        var setIcon = function(iconStr){
          var splicedStr = iconStr.split('.'),
            iconSetId,
            iconKey;

          if (splicedStr.length > 1) {
            iconSetId = splicedStr.splice(0, 1)[0];
            iconKey = splicedStr.join('.');

            scope.viewModel.iconSet = mwIcon.getIconSet(iconSetId);

            setViewIcon(iconKey);

            scope.viewModel.iconSet.on('icons:replace', function(){
              setViewIcon(iconKey);
            });

          } else {
            setIconOld(iconStr);
          }
        };

        scope.$watch('icon', function (newVal) {
          if (newVal) {
            setIcon(newVal);
          }
        });
      }
    };
  }]);
angular.module('mwUI.UiComponents')

  .directive('mwOptionGroup', function () {
    return {
      scope: {
        title: '@',
        description: '@',
        icon: '@',
        mwDisabled: '='
      },
      transclude: true,
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_option_group.html',
      link: function (scope, el) {
        scope.randomId = _.uniqueId('option_group_');
        el.find('input').attr('id', scope.randomId);
      }

    };
  });
angular.module('mwUI.UiComponents')

  .directive('mwPanel', function () {
    return {
      restrict: 'A',
      transclude: true,
      scope: {
        type: '@mwPanel',
        title: '@',
        closeable: '='
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_panel.html',
      link: function(scope, el){
        scope.closePanel = function(){
          el.remove();
        };
      }
    };
  });
angular.module('mwUI.UiComponents')

  .directive('mwSpinner', function () {
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_spinner.html'
    };
  });
angular.module('mwUI.UiComponents')

  .directive('mwRating', function () {
    return {
      restrict: 'A',
      scope: true,
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_star_rating.html',
      link: function (scope, elm, attr) {

        scope.stars = [];

        var buildStars = function () {
          scope.stars = [];

          var rating = scope.$eval(attr.mwRating) || 0;
          var starsMax = scope.$eval(attr.max) || 5;

          if (rating > starsMax) {
            rating = starsMax;
          }

          if (rating < 0) {
            rating = 0;
          }

          for (var i = 0; i < Math.floor(rating); i++) {
            scope.stars.push({state: 'fa-star'});
          }

          if (rating - Math.floor(rating) >= 0.5) {
            scope.stars.push({state: 'fa-star-half-full'});
          }

          while (attr.max && scope.stars.length < starsMax) {
            scope.stars.push({state: 'fa-star-o'});
          }
        };

        attr.$observe('mwRating', function () {
          buildStars();
        });

        attr.$observe('max', function () {
          buildStars();
        });
      }
    };
  });
angular.module('mwUI.UiComponents')
  //TODO rename
  .directive('mwTabs', function () {
    return {
      transclude: true,
      scope: {
        justified: '=',
        activePaneNumber: '='
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_tab_bar.html',
      controller: ['$scope', function ($scope) {
        var panes = $scope.panes = [];

        $scope.select = function (pane) {
          angular.forEach(panes, function (p) {
            p.selected = false;
          });

          if($scope.activePaneNumber){
            $scope.activePaneNumber = _.indexOf($scope.panes,pane)+1;
          }

          pane.selected = true;
        };

        this.registerPane = function (pane) {
          if ( ( $scope.activePaneNumber && $scope.activePaneNumber-1 === panes.length) || (!panes.length && !$scope.activePaneNumber) ) {
            var bak = $scope.activePaneNumber;
            $scope.select(pane);
            $scope.activePaneNumber = bak;
          }
          panes.push(pane);
        };
      }]
    };
  });
angular.module('mwUI.UiComponents')
  //TODO rename
  .directive('mwTabsPane', function () {
    return {
      scope: {
        title: '@mwTabsPane',
        isInvalid: '='
      },
      transclude: true,
      replace: true,
      require: '^mwTabs',
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_tab_pane.html',
      link: function (scope, elm, attr, mwTabsCtrl) {
        mwTabsCtrl.registerPane(scope);
      }
    };
  });
angular.module('mwUI.UiComponents')
  .directive('mwTextCollapsible', ['$filter', function ($filter) {
    return {
      restrict: 'A',
      scope: {
        collapsibleText: '@mwTextCollapsible',
        length: '='
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_text_collapsible.html',
      link: function (scope) {

        // set default length
        if (scope.length && typeof scope.length === 'number') {
          scope.defaultLength = scope.length;
        } else {
          scope.defaultLength = 200;
        }

        // set start length for filter
        scope.filterLength = scope.defaultLength;

        // apply filter length to text
        scope.text = function () {
          return $filter('reduceStringTo')(
            scope.collapsibleText, scope.filterLength
          );
        };

        // show Button if text is longer than desired
        scope.showButton = false;
        if (scope.collapsibleText && scope.collapsibleText.length > scope.defaultLength) {
          scope.showButton = true;
        }

        // set button to "show more" or "show less"
        scope.showLessOrMore = function () {
          if (scope.filterLength === scope.defaultLength) {
            return 'UiComponents.mwTextCollapsible.showMore';
          } else {
            return 'UiComponents.mwTextCollapsible.showLess';
          }
        };

        // collapse/expand text by setting filter length
        scope.toggleLength = function () {
          if (scope.filterLength === scope.defaultLength) {
            delete scope.filterLength;
          } else {
            scope.filterLength = scope.defaultLength;
          }
        };
      }
    };
  }]);

angular.module('mwUI.UiComponents')

  .directive('mwTimeline', function () {
    return {
      transclude: true,
      replace: true,
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_timeline.html'
    };
  });
angular.module('mwUI.UiComponents')

  .directive('mwTimelineEntry', ['$q', function ($q) {
    return {
      transclude: true,
      replace: true,
      template: '<li class="timeline-entry"><span class="bubble"></span><div ng-transclude></div></li>',
      scope: true,
      require: '^mwTimelineFieldset',
      link: function (scope, el, attrs, mwTimelineFieldsetController) {
        mwTimelineFieldsetController.register(scope);

        scope.hide = function () {
          var dfd = $q.defer();
          el.fadeOut('slow', function () {
            dfd.resolve();
          });
          return dfd.promise;
        };

        scope.show = function () {
          var dfd = $q.defer();
          el.fadeIn('slow', function () {
            dfd.resolve();
          });
          return dfd.promise;
        };
      }

    };
  }]);

angular.module('mwUI.UiComponents')

  .directive('mwTimelineFieldset', ['$q', function ($q) {
    return {
      scope: {
        mwTitle: '@',
        collapsable: '='
      },
      transclude: true,
      replace: true,
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_timeline_fieldset.html',
      controller: ['$scope', function ($scope) {
        $scope.entries = [];
        this.register = function (entry) {
          if (!_.findWhere($scope.entries, {$id: entry.$id})) {
            $scope.entries.push(entry);
          }
        };
        $scope.entriesVisible = true;
        $scope.toggleEntries = function () {
          if (!$scope.collapsable) {
            return;
          }
          var toggleEntryHideFns = [];
          $scope.entries.forEach(function (entry) {
            if ($scope.entriesVisible) {
              toggleEntryHideFns.push(entry.hide());
            } else {
              toggleEntryHideFns.push(entry.show());
            }
          });
          if (!$scope.entriesVisible) {
            $scope.entriesVisible = !$scope.entriesVisible;
          } else {
            $q.all(toggleEntryHideFns).then(function () {
              $scope.entriesVisible = !$scope.entriesVisible;
            });
          }
        };
        $scope.hiddenEntriesText = function () {
          if ($scope.entries.length > 1) {
            return 'UiComponents.mwTimelineFieldset.entriesHiddenPlural';
          } else {
            return 'UiComponents.mwTimelineFieldset.entriesHiddenSingular';
          }
        };
      }]
    };
  }]);

angular.module('mwUI.UiComponents')
  .directive('mwTooltip', function () {
    return {
      restrict: 'A',
      scope: {
        text: '@mwTooltip',
        placement: '@'
      },
      link: function (scope, el) {
        scope.$watch('text', function () {
          el.data('bs.popover').setContent();
        });

        el.popover({
          trigger: 'hover',
          placement: scope.placement || 'bottom',
          content: function () {
            return scope.text;
          },
          container: 'body'
        });

        var destroyPopOver = function () {
          var popover = el.data('bs.popover');
          if (popover && popover.tip()) {
            popover.tip().detach().remove();
          }
        };

        scope.$on('$destroy', function () {
          destroyPopOver();
        });
      }
    };
  });
angular.module('mwUI.UiComponents')

  .directive('mwViewChangeLoader', ['$rootScope', function ($rootScope) {
    return {
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_view_change_loader.html',
      link: function (scope) {
        scope.viewModel = {
          loading: false
        };

        var locationChangeSuccessListener = $rootScope.$on('$locationChangeSuccess', function () {
          scope.viewModel.loading = true;
        });

        var routeChangeSuccessListener = $rootScope.$on('$routeChangeSuccess', function () {
          scope.viewModel.loading = false;
        });

        var routeChangeErrorListener = $rootScope.$on('$routeChangeError', function () {
          scope.viewModel.loading = false;
        });

        scope.$on('$destroy', function () {
          locationChangeSuccessListener();
          routeChangeSuccessListener();
          routeChangeErrorListener();
        });
      }
    };
  }]);
angular.module('mwUI.UiComponents')

  .directive('mwWizard', ['Wizard', function (Wizard) {
    return {
      scope: {
        wizard: '=mwWizard'
      },
      transclude: true,
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_wizard.html',
      controller: ['$scope', function ($scope) {

        var wizard = $scope.wizard || Wizard.createWizard(_.uniqueId('wizard_'));

        this.registerStep = function (scope, id) {
          wizard._registerStep(scope, id);
        };

        this.unRegisterStep = function (scope) {
          wizard._unRegisterStep(scope);
        };

        this.getWizard = function(){
          return wizard;
        };

        $scope.$on('$destroy', function () {
          wizard.destroy();
        });

      }]
    };
  }]);
angular.module('mwUI.UiComponents')

  .directive('mwWizardNavigation', function () {
    return {
      scope: {
        finishedAction: '&'
      },
      transclude: true,
      require: '^mwWizard',
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_wizard_navigation.html',
      link: function (scope, el, attr, mwWizardCtrl, $transclude) {
        scope.wizard = mwWizardCtrl.getWizard();
        scope.finish = function(){
          scope.$eval(scope.finishedAction);
        };

        $transclude(function (clone) {
          var wizardEl = el.find('.mw-wizard-navigation');

          if ((clone && clone.length > 0)) {
            wizardEl.addClass('has-extra-content');
          }
        });
      }
    };
  });
angular.module('mwUI.UiComponents')

  .directive('mwWizardProgress', function () {
    return {
      require: '^mwWizard',
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_wizard_progress.html',
      link: function (scope, el, attr, mwWizardCtrl) {
        var wizard = mwWizardCtrl.getWizard();
        scope.getProgress = function(){
          return ((wizard.getCurrentStepNumber()+1) / wizard.getAllSteps().length ) *100;
        };
      }
    };
  });
angular.module('mwUI.UiComponents')

  .directive('mwWizardStep', function () {
    return {
      restrict: 'A',
      scope: true,
      transclude: true,
      replace: true,
      require: '^mwWizard',
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_wizard_step.html',
      link: function (scope, el, attr, mwWizardCtrl) {
        scope._isActive = false;
        //we need to set a default value here, see
        //https://github.com/angular/angular.js/commit/531a8de72c439d8ddd064874bf364c00cedabb11
        attr.title = attr.title || 'noname';
        attr.$observe('title', function (title) {
          if (title && title.length > 0) {
            scope.title = title;
          }
          mwWizardCtrl.registerStep(scope, attr.id);
        });

        scope.$on('$destroy', function () {
          mwWizardCtrl.unRegisterStep(scope);
        });
      }
    };
  });

/**
 * Created by zarges on 25/02/16.
 */
angular.module('mwUI.UiComponents')

  .provider('mwIcon', function () {

    var IconSet = Backbone.Model.extend({
        defaults: function () {
          return {
            classPrefix: '',
            type: 'FONTICON',
            iconsUrl: null,
            isLoading: false,
            loaded: false,
            icons: {}
          };
        },
        _throwNotValidIconError: function () {
          throw new Error('You have to set either icons or set a filePath');
        },
        _needsToBeLoaded: function(){
          return this.get('iconsUrl') && !this.get('loaded');
        },
        loadFn: function () {
          throw new Error('Has to overwritten with a real loader fn');
        },
        $q: null,
        getIconForKey: function (key) {
          var keys = key.split('.'),
            icons = this.get('icons'),
            dfd = this.$q(),
            icon;

          keys.forEach(function (key) {
            if (icon && icon[key]) {
              icon = icon[key];
            } else {
              icon = icons[key];
            }
          });

          if (icon && !this._needsToBeLoaded()) {
            dfd.resolve(icon);
          } else if (this._needsToBeLoaded()) {

            this.on('change:loaded', function () {
              return this.getIconForKey(key).then(function (icon) {
                dfd.resolve(icon);
              });
            }.bind(this));

            if (!this.get('isLoading')) {
              this.set('isLoading', true);
              this.loadFn().then(function (icons) {
                _.extend(this.get('icons'), icons);
                this.set('isLoading', false);
                this.set('loaded', true);
              }.bind(this));
            }

          } else {
            throw new Error('No Icon was found for the key ' + key);
          }
          return dfd.promise;
        },
        isValidIcon: function (icon) {
          return (icon.icons && _.size(icon.icons) > 0 || icon.iconsUrl);
        },
        addIcons: function (icons, replace) {
          var alreadyRegistered = _.intersection(_.keys(this.get('icons')), _.keys(icons));
          if (alreadyRegistered.length > 0 && !replace) {
            throw new Error('The icons ' + alreadyRegistered.join(',') + ' already exists. If you want to replace them use the method replaceIcons');
          } else {
            _.extend(this.get('icons'), icons);
            if(alreadyRegistered.length>0){
              this.trigger('icons:replace');
            } else {
              this.trigger('icons:add', icons);
            }
          }
        },
        replaceIcons: function (icons) {
          if (!this._needsToBeLoaded()) {
            this.addIcons(icons, true);
          } else {
            this.on('change:loaded', function () {
              this.addIcons(icons, true);
            }.bind(this));
          }
        },
        constructor: function (icon, options) {
          if (!this.isValidIcon(icon)) {
            this._throwNotValidIconError();
          }
          if (icon.iconsUrl) {
            icon.loaded = false;
          }
          return Backbone.Model.prototype.constructor.call(this, icon, options);
        }
      }),
      IconSets = Backbone.Collection.extend({
        model: IconSet
      }),
      icons = new IconSets();

    var _addIconSet = function (iconSet) {
      if (!iconSet.id) {
        throw new Error('You have to set an identifier for you iconset');
      } else if (icons.get(iconSet.id)) {
        throw new Error('The iconset has already been registered');
      } else {
        icons.add(iconSet);
      }
    };

    var _getIconSet = function (id) {
      var icon = icons.get(id);
      if (icon) {
        return icon;
      } else {
        throw new Error('No iconset has been found for the id ' + id);
      }
    };

    this.addIconSet = _addIconSet;

    this.getIconSet = _getIconSet;

    this.$get = ['$q', '$templateRequest', function ($q, $templateRequest) {
      var _loadIconFile = function (icon) {
        icon.$q = $q.defer;
        icon.loadFn = function () {
          return $templateRequest(icon.get('iconsUrl')).then(function (content) {
            return JSON.parse(content);
          });
        };
      };

      icons.each(_loadIconFile);
      icons.on('add', _loadIconFile);

      return {
        addIconSet: _addIconSet,
        getIconSet: _getIconSet
      };
    }];

  });
angular.module('mwUI.UiComponents')

  .service('Wizard', function () {

    var wizards = [];

    var Wizard = function (id) {

      var _steps = [],
        _currentlyActive = 0,
        _id = id;

      /*
       * name _registerStep()
       * @description
       * This method should not be called manually but rather automatically by using the mwWizardStep directive
       */
      this._registerStep = function (step, id) {
        if (_steps.length < 1) {
          step._isActive = true;
        }
        step.slideId = id || _.uniqueId(_id + '_');
        _steps.push(step);
      };

      /*
       * name _registerStep()
       * @description
       * This method should not be called manually but rather automatically by using the mwWizardStep directive
       */
      this._unRegisterStep = function (scope) {
        var scopeInArray = _.findWhere(_steps, {$id: scope.$id}),
          indexOfScope = _.indexOf(_steps, scopeInArray);

        if (indexOfScope > -1) {
          _steps.splice(indexOfScope, 1);
        }
      };

      this.destroy = function () {
        var self = this;
        _steps.forEach(function (step) {
          self._unRegisterStep(step);
        });
      };

      this.getId = function () {
        return _id;
      };

      this.getAllSteps = function () {
        return _steps;
      };

      this.getCurrentStep = function () {
        return _steps[_currentlyActive];
      };

      this.getCurrentStepNumber = function () {
        return _currentlyActive;
      };

      this.getCurrentStepId = function () {
        return _steps[_currentlyActive].slideId;
      };

      this.getTotalStepAmount = function () {
        return _steps.length;
      };

      this.hasNextStep = function () {
        return this.getCurrentStepNumber() < this.getTotalStepAmount() - 1;
      };

      this.hasPreviousStep = function () {
        return this.getCurrentStepNumber() > 0;
      };

      /*
       * name next()
       * @description
       * Navigates to the next step of the currently active step
       */
      this.next = function () {
        this.goTo(_currentlyActive + 1);
      };

      /*
       * name back()
       * @description
       * Navigates to the previous step of the currently active step
       */
      this.back = function () {
        this.goTo(_currentlyActive - 1);
      };

      this.gotoStep = function (step) {

        if (typeof step === 'string') {
          step = _.findWhere(_steps, {slideId: step});
        }

        this.goTo(_.indexOf(_steps, step));
      };

      /*
       * name goTo()
       * @description
       * Goto a specific step number
       *
       * @params {integer} number of the step where you want to navigate to
       */
      this.goTo = function (num) {
        _steps[_currentlyActive]._isActive = false;
        if (num >= _steps.length) {
          throw new Error('Step ' + (num + 1) + ' is not available');
        } else {
          _steps[num]._isActive = true;
          _currentlyActive = num;
        }
      };

    };

    /*
     * name findWizard()
     * @description
     * Finds an existing instance of a wizzard with a certain id but throws NO error
     * when the wizard with the id could not be found
     *
     * @params {string} id Unique identifier of the Wizard you want to find
     * @returns {object} wizard returns wizard object
     */
    var findWizard = function (id) {
      var _wizard = null;
      wizards.forEach(function (wizard) {
        if (wizard.getId === id) {
          _wizard = wizard;
        }
      });
      return _wizard;
    };

    /*
     * name getWizard()
     * @description
     * Finds an existing instance of a wizzard with a certain id and throws an error
     * when the wizard with the id could not be found
     *
     * @params {string} id Unique identifier of the Wizard you want to find
     * @returns {object} wizard returns wizard object
     */
    var getWizard = function (id) {
      var _wizard = findWizard(id);
      if (!_wizard) {
        throw new Error('The wizard with the id ' + id + ' does not exist');
      } else {
        return _wizard;
      }

    };

    /*
     * name createWizard
     * @description
     * Creates an instance of Wizard. Throws an error when wizzard with the id
     * could not be found or is not initialized yet
     *
     * @param {string} id Unique identifier of the Wizard
     * @returns {object} wizard returns wizard object
     */
    var createWizard = function (id) {
      if (findWizard(id)) {
        throw new Error('The wizard with the id ' + id + ' is already existing');
      } else {
        var wizard = new Wizard(id);
        wizards.push(wizard);
        return wizard;
      }
    };

    //Public interface of the service
    return {
      createWizard: createWizard,
      getWizard: getWizard
    };

  });

angular.module('mwUI.UiComponents')

  .config(['i18nProvider', function(i18nProvider){
    i18nProvider.addResource('uikit/mw-ui-components/i18n');
  }]);

})(window, angular);