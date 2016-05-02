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

    .config(['i18nProvider', function (i18nProvider) {
      i18nProvider.addLocale('de_DE', 'Deutsch', 'de_DE.json');
      i18nProvider.addLocale('en_US', 'English (US)', 'en_US.json');
    }])

    .run(['i18n', function(i18n){
      i18n.setLocale('en_US');
    }]);

  //This is only for backwards compatibility and should not be used
  window.mCAP = window.mCAP || {};

  root.mwUI = {};

angular.module("mwUI").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('uikit/mw-layout/directives/templates/mw_app.html',
    "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><title>Title</title></head><body></body></html>"
  );


  $templateCache.put('uikit/mw-layout/directives/templates/mw_header.html',
    "<div class=\"mw-header row\"><div class=\"fixed-content col-md-12\"><div ng-if=\"showBackButton\" class=\"back-btn clickable\" data-text=\"{{'common.back' | i18n}}\" ng-click=\"back()\"><span mw-icon=\"fa-angle-left\"></span></div><div class=\"title-holder\"><span mw-icon=\"{{mwTitleIcon}}\" class=\"header-icon\" ng-if=\"mwTitleIcon\"></span><div ng-if=\"mwBreadCrumbs\" mw-bread-crumbs-holder><div ng-repeat=\"breadCrumb in mwBreadCrumbs\" mw-bread-crumb url=\"{{breadCrumb.url}}\" title=\"{{breadCrumb.title}}\" show-arrow=\"true\"></div></div><h1 class=\"lead page-title\" ng-click=\"refresh()\">{{title}}</h1></div><div ng-if=\"warningCondition\" class=\"warnin-content\" mw-tooltip=\"{{ warningText }}\"><span class=\"text-warning\" mw-icon=\"fa-warning\"></span> <span class=\"popover-container\"></span></div><div class=\"additional-content-holder\" ng-transclude></div></div></div>"
  );


  $templateCache.put('uikit/mw-layout/directives/templates/mw_sub_nav.html',
    "<div class=\"row\"><div class=\"mw-sub-nav col-md-12\"><ul class=\"nav nav-pills\" ng-class=\"{'nav-justified':justified}\" ng-transclude></ul></div></div>"
  );


  $templateCache.put('uikit/mw-layout/directives/templates/mw_sub_nav_pill.html',
    "<li class=\"mw-sub-nav-pill\" ng-class=\"{mwDisabled: mwDisabled}\"><div class=\"btn btn-link\" ng-click=\"navigate(url)\" ng-class=\"{disabled: mwDisabled}\" ng-transclude></div></li>"
  );


  $templateCache.put('uikit/mw-list/directives/templates/mw_list_body_row_checkbox.html',
    "<input ng-if=\"!isSingleSelection\" type=\"checkbox\" ng-click=\"click(item, $event)\" ng-disabled=\"item.selectable.isDisabled()\" ng-checked=\"item.selectable.isSelected()\" mw-custom-checkbox> <input ng-if=\"isSingleSelection\" type=\"radio\" name=\"{{selectable.id}}\" ng-click=\"click(item, $event)\" ng-disabled=\"item.selectable.isDisabled()\" ng-checked=\"item.selectable.isSelected()\" mw-custom-radio>"
  );


  $templateCache.put('uikit/mw-list/directives/templates/mw_list_footer.html',
    "<tr><td colspan=\"{{ columns.length + 4 }}\"><div ng-if=\"Loading.isLoading() && collection.filterable.hasNextPage()\"><div rln-spinner></div></div><div ng-if=\"collection.models.length < 1\" class=\"text-center\"><p class=\"lead\">{{ 'List.mwListFooter.noneFound' | i18n }}</p></div></td></tr>"
  );


  $templateCache.put('uikit/mw-list/directives/templates/mw_list_head.html',
    "<div class=\"mw-listable-header clearfix\" ng-class=\"{'show-selected':canShowSelected(),'has-selection-control':!selectable.isSingleSelection() || selectedAmount > 0}\"><div class=\"selection-controller\"><div ng-if=\"selectable\" class=\"holder\"><span ng-click=\"toggleSelectAll()\" class=\"clickable select-all\" ng-if=\"!selectable.isSingleSelection()\"><span class=\"selected-icon\"><span class=\"indicator\" ng-if=\"selectable.allSelected()\"></span></span> <a href=\"#\" mw-prevent-default=\"click\">{{'List.mwListHead.selectAll' | i18n }}</a></span> <span ng-if=\"selectedAmount > 0\" class=\"clickable clear\" ng-click=\"selectable.unSelectAll()\"><span mw-icon=\"fa-times\"></span> <a href=\"#\" mw-prevent-default=\"click\">{{'List.mwListHead.clearSelection' | i18n}}</a></span></div></div><div class=\"search-bar\"><div ng-if=\"searchAttribute\" mw-filterable-search-bb collection=\"collection\" placeholder=\"{{'mwUI.List.listHead.searchFor' | i18n:{name: collectionName} }}\" property=\"{{searchAttribute}}\"></div></div><div class=\"selected-counter\"><span ng-if=\"selectable && selectedAmount>0\" class=\"clickable\" ng-click=\"toggleShowSelected()\"><a href=\"#\" mw-prevent-default=\"click\"><span ng-if=\"selectedAmount === 1\">{{'List.mwListHead.itemSelected' | i18n:{name: getModelAttribute(selectable.getSelected().first())} }}</span> <span ng-if=\"selectedAmount > 1\">{{'List.mwListHead.itemsSelected' | i18n:{name: collectionName, count: selectedAmount} }}</span> <span mw-icon=\"fa-angle-up\" ng-show=\"canShowSelected()\"></span> <span mw-icon=\"fa-angle-down\" ng-show=\"!canShowSelected()\"></span></a></span><div ng-if=\"!selectable || selectedAmount<1\" ng-transclude class=\"extra-content\"></div><span ng-if=\"!selectable || selectedAmount<1\">{{'List.mwListHead.itemAmount' | i18n:{name: collectionName, count: getTotalAmount()} }}</span></div><div class=\"selected-items\" ng-if=\"canShowSelected()\"><div class=\"items clearfix\"><div class=\"box-shadow-container\"><div ng-if=\"!isLoadingModelsNotInCollection\" ng-repeat=\"item in selectable.getSelected().models\" ng-click=\"unSelect(item)\" ng-class=\"{'label-danger':item.selectable.isDeletedItem}\" class=\"label label-default clickable\"><span ng-if=\"item.selectable.isDeletedItem\" mw-tooltip=\"{{'List.mwListHead.notAvailableTooltip' | i18n}}\"><span mw-icon=\"fa-warning\"></span>{{'List.mwListHead.notAvailable' | i18n}}</span> <span ng-if=\"!item.selectable.isDeletedItem\">{{getModelAttribute(item)}}</span> <span mw-icon=\"fa-times\"></span></div><div ng-if=\"isLoadingModelsNotInCollection\"><div rln-spinner></div></div></div></div><div class=\"close-pane\" ng-click=\"hideSelected()\"></div></div></div>"
  );


  $templateCache.put('uikit/mw-list/directives/templates/mw_list_header.html',
    "<th ng-class=\"{ clickable: property, 'sort-active':(property && isSelected())||sortActive }\"><span ng-if=\"property\" ng-click=\"toggleSortOrder()\" class=\"sort-indicators\"><i ng-show=\"property && !isSelected()\" mw-icon=\"fa-sort\" class=\"sort-indicator\"></i> <i ng-if=\"isSelected('-')\" mw-icon=\"fa-sort-asc\"></i> <i ng-if=\"isSelected('+')\" mw-icon=\"fa-sort-desc\"></i></span> <span ng-transclude class=\"title\"></span></th>"
  );


  $templateCache.put('uikit/mw-menu/directives/templates/mw_menu.html',
    "<div class=\"mw-menu\"><div ng-repeat=\"entry in menu.models\">{{entry.get('label')}}</div></div>"
  );


  $templateCache.put('uikit/mw-menu/directives/templates/mw_sidebar_menu.html',
    "<div class=\"mw-sidebar-menu\"><div class=\"logo\"></div><div mw-menu=\"ctrl.mwMenu\"></div><div class=\"additonal-content\" ng-transclude></div></div>"
  );


  $templateCache.put('uikit/mw-modal/directives/templates/mw_modal.html',
    "<div class=\"modal fade\" tabindex=\"-1\" role=\"dialog\"><div class=\"modal-dialog\" role=\"document\"><div class=\"modal-content\"><div class=\"modal-header clearfix\" ng-if=\"title\"><img ng-if=\"mwModalTmpl.getLogoPath()\" ng-src=\"{{mwModalTmpl.getLogoPath()}}\" class=\"pull-left logo\"><h4 class=\"modal-title pull-left\">{{ title }}</h4></div><div class=\"body-holder\"><div mw-toasts class=\"notifications\"></div><div ng-transclude class=\"modal-content-wrapper\"></div></div></div></div></div>"
  );


  $templateCache.put('uikit/mw-modal/directives/templates/mw_modal_body.html',
    "<div class=\"modal-body clearfix\" ng-transclude></div>"
  );


  $templateCache.put('uikit/mw-modal/directives/templates/mw_modal_confirm.html',
    "<div mw-modal title=\"{{ 'Modal.mwModalConfirm.areYouSure' | i18n }}\"><div mw-modal-body><div ng-transclude></div></div><div mw-modal-footer><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" ng-click=\"cancel()\">{{'Modal.mwModalConfirm.cancel' | i18n }}</button> <button type=\"button\" mw-modal-on-enter class=\"btn btn-primary\" data-dismiss=\"modal\" ng-click=\"ok()\">{{'Modal.mwModalConfirm.ok' | i18n }}</button></div></div>"
  );


  $templateCache.put('uikit/mw-modal/directives/templates/mw_modal_footer.html',
    "<div class=\"modal-footer\" ng-transclude></div>"
  );


  $templateCache.put('uikit/mw-toast/directives/templates/mw_toasts.html',
    "<div class=\"message messages-list mw-toasts\"><div class=\"content\"><ul><li ng-repeat=\"toast in toasts\" class=\"message-item\"><div class=\"status-indicator {{toast.type}}\"><span mw-icon=\"{{toast.icon}}\"></span></div><div class=\"message\"><div class=\"holder margin-top-5\"><h5 ng-if=\"toast.title\">{{toast.title}}</h5><span ng-if=\"!toast.isHtmlMessage\">{{toast.message | limitTo:500}}</span> <span ng-if=\"toast.isHtmlMessage\" ng-bind-html=\"toast.message\"></span> <a class=\"action-button btn btn-link btn-xs\" ng-if=\"toast.button && toast.button.isLink && toast.button.action && !toast.button.link\" href=\"#\"><span ng-click=\"hideToast(toast); toast.button.action()\" mw-prevent-default=\"click\">{{toast.button.title}}</span></a> <a class=\"action-button btn btn-link btn-xs\" ng-if=\"toast.button && toast.button.isLink && toast.button.link\" ng-href=\"{{toast.button.link}}\" target=\"{{toast.button.target}}\"><span>{{toast.button.title}}</span></a><div ng-if=\"toast.button && !toast.button.isLink && toast.button.action\"><div class=\"action-button btn btn-default btn-xs margin-top-5\"><div ng-click=\"hideToast(toast); toast.button.action()\">{{toast.button.title}}</div></div></div></div><div class=\"closer\" ng-click=\"hideToast(toast.id)\"><span mw-icon=\"fa-times\"></span></div></div></li></ul></div></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_alert.html',
    "<div class=\"mw-alert alert alert-{{ type || 'default' }}\"><div ng-transclude class=\"alert-content\"></div><div ng-if=\"closeable\" ng-click=\"closeAlert()\" mw-icon=\"fa-times\"></div></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_arrow_link.html',
    "<a ng-href=\"{{ link }}\" class=\"btn btn-default btn-sm mw-arrow-link\" mw-stop-propagation=\"click\"><span mw-icon=\"fa-angle-right\"></span></a>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_badge.html',
    "<span class=\"mw-badge label label-{{mwBadge}}\" ng-transclude></span>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_bread_crumb.html',
    "<div class=\"mw-bread-crumb\"><a ng-href=\"{{url}}\" class=\"bread-crumb\">{{title}}</a> <span mw-icon=\"fa-caret-right\" class=\"arrow\"></span></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_bread_crumbs_holder.html',
    "<div class=\"mw-bread-crumbs-holder\" ng-transclude></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_collapsable.html',
    "<div class=\"mw-collapsable\"><div class=\"mw-collapsable-heading\" ng-click=\"toggle()\"><i class=\"fa fa-angle-right\" ng-class=\"{'fa-rotate-90': viewModel.collapsed}\"></i> <span class=\"mw-collapsable-heading-text\">{{title}}</span></div><div ng-class=\"{'collapsed': viewModel.collapsed}\" class=\"mw-collapsable-body mw-collapsable-animate margin-top-5\" ng-transclude></div></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_icon.html',
    "<i ng-class=\"iconClasses\" style=\"{{style}}\" mw-tooltip=\"{{tooltip}}\" placement=\"{{placement}}\"></i>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_option_group.html',
    "<div class=\"mw-option-group panel panel-default\"><fieldset ng-disabled=\"mwDisabled\"><div class=\"panel-body\"><span ng-transclude></span><label class=\"options-container display-inline clickable\" ng-class=\"{'with-icon':icon}\" for=\"{{randomId}}\"><div class=\"clearfix\"><div ng-if=\"icon\" class=\"col-md-1 icon-holder\"><span mw-icon=\"{{icon}}\"></span></div><div class=\"description\" ng-class=\"{'col-md-11': icon, 'col-md-12': !icon}\"><h4>{{title}}</h4><p>{{description}}</p></div></div></label></div></fieldset></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_panel.html',
    "<div class=\"mw-panel panel panel-{{type || 'default'}}\"><div class=\"panel-heading\" ng-if=\"title\"><h3 class=\"panel-title\">{{title}}</h3><span ng-if=\"closeable\" ng-click=\"closePanel()\" mw-icon=\"fa-times\"></span></div><div class=\"panel-body\" ng-transclude></div></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_star_rating.html',
    "<span class=\"mw-star-rating\"><i ng-repeat=\"star in stars\" ng-class=\"star.state\" class=\"fa\"></i></span>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_text_collapsable.html',
    "<div class=\"mw-text-collapsable\"><div ng-if=\"markdown\"><div mw-markdown=\"text()\"></div><a ng-if=\"showButton\" ng-click=\"toggleLength()\">{{ showLessOrMore() | i18n }}</a></div><div ng-if=\"!markdown\"><span class=\"line-break\">{{ text() }}</span> <a ng-if=\"showButton\" ng-click=\"toggleLength()\">{{ showLessOrMore() | i18n }}</a></div></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_timeline.html',
    "<div class=\"mw-timeline timeline clearfix\"><hr class=\"vertical-line\"><div class=\"content\" ng-transclude></div></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_timeline_entry.html',
    "<li class=\"timeline-entry\"><span class=\"bubble\"></span><div ng-transclude></div></li>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_timeline_fieldset.html',
    "<fieldset class=\"mw-timeline-fieldset\" ng-class=\"{'entries-are-hidden':!entriesVisible, 'collapsable': collapsable}\"><div ng-if=\"mwTitle\" ng-click=\"toggleEntries()\" class=\"legend\">{{mwTitle}} <span ng-if=\"collapsable && entriesVisible\" class=\"toggler\"><i mw-icon=\"fa-chevron-circle-down\"></i></span> <span ng-if=\"collapsable && !entriesVisible\" class=\"toggler\"><i mw-icon=\"fa-chevron-circle-up\"></i></span></div><div ng-show=\"!entriesVisible\" class=\"hidden-entries\" ng-click=\"toggleEntries()\">{{ hiddenEntriesText() | i18n:{count:entries.length} }}</div><ul class=\"clearfix timeline-entry-list\" ng-transclude ng-show=\"entriesVisible\"></ul></fieldset>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_toggle.html',
    "<div class=\"mw-toggle\"><button class=\"no toggle btn btn-link\" ng-click=\"toggle(true)\" ng-disabled=\"mwDisabled\"><span>{{ 'UiComponents.mwToggle.on' | i18n }}</span></button> <button class=\"yes toggle btn btn-link\" ng-click=\"toggle(false)\" ng-disabled=\"mwDisabled\"><span>{{ 'UiComponents.mwToggle.off' | i18n }}</span></button> <span class=\"label indicator\" ng-class=\"{ true: 'label-success enabled', false: 'label-danger' }[mwModel]\"></span></div>"
  );


  $templateCache.put('uikit/mw-ui-components/directives/templates/mw_view_change_loader.html',
    "<div class=\"mw-view-change-loader\" ng-if=\"viewModel.loading\"><div class=\"spinner\"></div></div>"
  );


  $templateCache.put('uikit/templates/mwSidebarBb/mwSidebarInput.html',
    "<div class=\"row\"><div class=\"col-md-12 form-group\" ng-class=\"{'has-error': !isValid()}\" style=\"margin-bottom: 0\"><input type=\"{{_type}}\" ng-if=\"!customUrlParameter\" class=\"form-control\" ng-model=\"viewModel.val\" ng-change=\"changed()\" ng-disabled=\"mwDisabled\" placeholder=\"{{placeholder}}\" ng-model-options=\"{ debounce: 500 }\"><input type=\"{{_type}}\" ng-if=\"customUrlParameter\" class=\"form-control\" ng-model=\"viewModel.val\" ng-change=\"changed()\" ng-disabled=\"mwDisabled\" placeholder=\"{{placeholder}}\" ng-model-options=\"{ debounce: 500 }\"></div></div>"
  );


  $templateCache.put('uikit/mw-list/i18n/de_DE.json',
    "{ \"List\": { \"mwListHead\": { \"items\": \"Einträge\", \"selectAll\": \"Alle selektieren\", \"clearSelection\": \"Selektion aufheben\", \"itemSelected\": \"{{name}} ist selektiert\", \"itemsSelected\": \"{{count}} {{name}} sind selektiert\", \"itemAmount\": \"{{count}} {{name}}\", \"searchFor\": \"{{name}} suchen\", \"notAvailable\": \"N/V\", \"notAvailableTooltip\": \"Der Eintrag ist nicht verfügbar. Eventuell wurde dieser gelöscht.\" }, \"mwListFooter\": { \"noneFound\": \"Es wurden keine Einträge gefunden\" } } }"
  );


  $templateCache.put('uikit/mw-list/i18n/en_US.json',
    "{ }"
  );


  $templateCache.put('uikit/mw-modal/i18n/de_DE.json',
    "{ \"Modal\": { \"mwModalConfirm\": { \"areYouSure\": \"Sind Sie sich sicher?\", \"ok\": \"Ok\", \"cancel\": \"Abbrechen\" } } }"
  );


  $templateCache.put('uikit/mw-modal/i18n/en_US.json',
    "{ }"
  );


  $templateCache.put('uikit/mw-ui-components/i18n/de_DE.json',
    "{ \"UiComponents\": { \"mwToggle\": { \"on\": \"An\", \"off\": \"Aus\" }, \"mwTimelineFieldset\": { \"entriesHiddenSingular\": \"1 Eintrag ist ausgeblendet\", \"entriesHiddenPlural\": \"{{count}} Einträge sind ausgeblendet\" }, \"mwTextCollapsable\": { \"showMore\": \"mehr anzeigen\", \"showLess\": \"weniger anzeigen\" }, \"mwButtonHelp\": { \"isDisabledBecause\": \"Dieser Button ist deaktiviert weil:\" } } }"
  );


  $templateCache.put('uikit/mw-ui-components/i18n/en_US.json',
    "{ \"UiComponents\": { \"mwToggle\": { \"on\": \"On\", \"off\": \"Off\" }, \"mwTimelineFieldset\": { \"entriesHiddenSingular\": \"One entry is hidden\", \"entriesHiddenPlural\": \"{{count}} entries are hidden\" } } }"
  );
}]);

/**
 * Created by zarges on 17/02/16.
 */
angular.module('mwUI.Utils', []);

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
  }])
angular.module('mwUI.Utils')

  .directive('mwInfiniteScroll', ['$window', '$document', function ($window, $document) {
    return {
      restrict: 'A',
      link: function (scope, el, attrs) {

        var collection,
          loading = false,
          throttledScrollFn,
          scrollFn,
          documentEl,
          scrollEl;

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

        var scrollCallback = function () {
          if (!loading && scrollEl.scrollTop() >= ((documentEl.height() - scrollEl.height()) - 100) && collection.filterable.hasNextPage()) {
            loading = true;
            collection.filterable.loadNextPage().then(function () {
              loading = false;
            });
          }
        };
        var modalScrollCallback = function () {
          if (!loading &&
            collection.filterable.hasNextPage() &&
            scrollEl[0].scrollHeight > 0 &&
            (scrollEl[0].scrollHeight - scrollEl.scrollTop() - scrollEl[0].clientHeight < 2)) {
            loading = true;
            collection.filterable.loadNextPage().then(function () {
              loading = false;
            });
          }
        };

        if (el.parents('.modal').length) {
          //element in modal
          scrollEl = el.parents('.modal-body');
          scrollFn = modalScrollCallback;
        }
        else {
          //element in window
          documentEl = angular.element($document);
          scrollEl = angular.element($window);
          scrollFn = scrollCallback;
        }

        throttledScrollFn = _.throttle(scrollFn, 500);

        // Register scroll callback
        scrollEl.on('scroll', throttledScrollFn);

        // Deregister scroll callback if scope is destroyed
        scope.$on('$destroy', function () {
          scrollEl.off('scroll', throttledScrollFn);
        });

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

/**
 * Created by zarges on 17/02/16.
 */
window.mwUI.Utils.shims.routeToRegExp = function(route){
  var  optionalParam = /\((.*?)\)/g,
    namedParam = /(\(\?)?:\w+/g,
    splatParam = /\*\w?/g,
    escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  route = route.replace(escapeRegExp, '\\$&')
    .replace(optionalParam, '(?:$1)?')
    .replace(namedParam, function (match, optional) {
      return optional ? match : '([^/?]+)';
    })
    .replace(splatParam, '([^?]*?)');
  return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
};

/**
 * Created by zarges on 15/02/16.
 */
window.mwUI.Backbone = {
  baseUrl: '',
  Selectable: {},
  concatUrlParts: function () {
    var concatUrl = '';
    _.forEach(arguments, function (url) {
      url = url.replace(/^\//, '');
      url = url.replace(/\/$/, '');
      concatUrl += ( url + ('/') );
    });
    return concatUrl;
  }
};

angular.module('mwUI.Backbone', []);


/**
 * Created by zarges on 15/02/16.
 */
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

    obj = this._setNestedAttributes(obj);

    return Backbone.Model.prototype.set.call(this, obj);
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

  clear: function () {
    var superClear = Backbone.Model.prototype.clear.apply(this, arguments);
    this.attributes = this._prepare();
    return superClear;
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
/**
 * Created by zarges on 04/03/16.
 */
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
      return window.mwUI.Backbone.concatUrlParts(mwUI.Backbone.baseUrl, basePath, endpoint);
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


/**
 * Created by zarges on 04/03/16.
 */
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

/**
 * Created by zarges on 04/03/16.
 */
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
      filterDefinition: function () {
      },
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
/**
 * Created by zarges on 04/03/16.
 */
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
      return window.mwUI.Backbone.concatUrlParts(mwUI.Backbone.baseUrl, basePath, endpoint);
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

/**
 * Created by zarges on 15/02/16.
 */

var _$http,
  _$q,
  _sync = Backbone.sync,
  _ajax = Backbone.ajax;

angular.module('mwUI.Backbone')

  .config(function () {
    Backbone.sync = function (method, model, options) {
      // Instead of the response object we are returning the backbone model in the promise
      return _sync.call(Backbone, method, model, options).then(function () {
        return model;
      });
    };
    Backbone.ajax = function (options) {
      if (_$http) {
        // Set HTTP Verb as 'method'
        options.method = options.type;
        // Use angulars $http implementation for requests
        return _$http.apply(angular, arguments);
      } else {
        return _ajax.apply(this, arguments);
      }
    };
  })

  .run(['$http', '$q', function ($http, $q) {
    _$http = $http;
    _$q = $q;
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

      var re = /{{([a-zA-Z0-9$_]+)}}/g,
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
          str = str.replace('{{' + usedPlaceholder + '}}', placeholders[usedPlaceholder]);
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
angular.module('mwUI.Inputs', []);

angular.module('mwUI.Inputs')

  //TODO rename to mwCheckbox
  .directive('mwCustomCheckbox', function () {
    return {
      restrict: 'A',
      link: function (scope, el) {
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

        (function init() {
          //after this the remaining element is removed
          scope.$on('$destroy', function () {
            el.off();
            el.parent('.mw-checkbox').remove();
          });

          render();

        }());
      }
    };
  });
angular.module('mwUI.Inputs')

  //TODO rename to mwRadio
  .directive('mwCustomRadio', function () {
    return {
      restrict: 'A',
      link: function (scope, el) {
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

        (function init() {
          //after this the remaining element is removed
          scope.$on('$destroy', function () {
            el.off();
            el.parent('.mw-radio').remove();
          });

          render();

        }());
      }
    };
  });
angular.module('mwUI.Inputs')

  //TODO rename to mwSelect
  .directive('mwCustomSelect', function () {
    return {
      require: '^?ngModel',
      link: function (scope, el) {
        var customSelectWrapper = angular.element('<span class="custom-select mw-select"></span>');

        var render = function () {
          el.wrap(customSelectWrapper);
          el.addClass('custom');
        };

        render();
      }
    };
  });
angular.module('mwUI.Layout', []);

angular.module('mwUI.Layout')

  .directive('mwHeader', ['$rootScope', '$route', '$location', function ($rootScope, $route, $location) {
    return {
      transclude: true,
      scope: {
        title: '@',
        url: '@',
        mwTitleIcon: '@',
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
angular.module('mwUI.List', ['mwUI.i18n']);

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
          console.log(_collection)
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
          console.warn('The scope attribute collection is deprecated please use the mwCollection instead');
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

  .directive('mwListFooterRow', ['Loading', function (Loading) {
    return {
      require: '^mwListableBb',
      templateUrl: 'uikit/templates/mwList/mw-list-footer.html',
      link: function (scope, elm, attr, mwListCtrl) {
        scope.Loading = Loading;
        scope.collection = mwListCtrl.getCollection();
        scope.columns = mwListCtrl.getColumns();
      }
    };
  }]);
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
            console.log(newOffset);
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
            collection.filterable.getSortOrder();
          } else {
            return false;
          }
        };

        var sort = function (property, order) {
          var sortOrder = order + property;

          collection.filterable.setSortOrder(sortOrder);
          return collection.fetch();
        };


        scope.toggleSortOrder = function () {
          if (scope.property) {
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
    return this.get('url').match(routeToRegex(url));
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

    var mwMenu = new mwUI.Menu.MwMenu();

    this.getMenu = function () {
      return mwMenu;
    };

    this.$get = function () {
      return mwMenu;
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

  .directive('mwSidebarMenu', ['mwSidebarMenu', function (mwSidebarMenu) {
    return {
      templateUrl: 'uikit/mw-menu/directives/templates/mw_sidebar_menu.html',
      transclude: true,
      controllerAs: 'ctrl',
      controller: function(){
        this.mwMenu = mwSidebarMenu;
      }
    };
  }]);
angular.module('mwUI.Modal', []);

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

  .service('Modal', ['$rootScope', '$templateCache', '$document', '$compile', '$controller', '$q', '$templateRequest', '$timeout', 'Toast', function ($rootScope, $templateCache, $document, $compile, $controller, $q, $templateRequest, $timeout, Toast) {

    var _body = $document.find('body').eq(0),
      _openedModals = [];

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
            var $bootstrapBackdrop = _bootstrapModal.data()['bs.modal'].backdrop;
            _bootstrapModal.data()['bs.modal'].backdrop = function (callback) {
              $bootstrapBackdrop.call(_bootstrapModal.data()['bs.modal'], callback, $(_holderEl).find('.modal'));
            };
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
        _body.css({
          height: '100%',
          width: '100%',
          overflow: 'hidden'
        });
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
          _body.css({
            height: '',
            width: '',
            overflow: ''
          });
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

angular.module('mwUI.Modal')

  .config(['i18nProvider', function(i18nProvider){
    i18nProvider.addResource('uikit/mw-modal/i18n');
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

      var replaceMessage = function (newMessage) {
        toast.message = newMessage;
        toast.replaceCount++;
        resetAutoHideTimer();
      };

      var setAutoHideCallback = function (fn) {
        toast.autoHideCallback = fn;
        resetAutoHideTimer();
      };

      var resetAutoHideTimer = function () {
        if (_autoRemoveTimeout) {
          window.clearTimeout(_autoRemoveTimeout);
        }
        startAutoHideTimer();
      };

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
          replaceMessage: replaceMessage,
          replaceCount: 0,
          setAutoHideCallback: setAutoHideCallback,
          initDate: +new Date()
        },
        _autoRemoveTimeout;

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

angular.module('mwUI.UiComponents', []);

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

  .directive('mwButtonHelp', ['i18n', function (i18n) {
    return {
      restrict: 'A',
      scope: true,
      link: function (scope, elm) {
        var popup;
        elm.addClass('mw-button-help');
        var helpIcon = angular.element('<div>').addClass('help-icon fa fa-question hidden-sm hidden-xs');
        elm.prepend(helpIcon);

        helpIcon.hover(function () {
          buildPopup();
          var targetOffset = angular.element(this).offset();
          angular.element('body').append(popup);
          popup.css('top', targetOffset.top - (popup.height() / 2) + 10 - angular.element(document).scrollTop());
          popup.css('left', (targetOffset.left + 40));
        }, function () {
          angular.element('body > .mw-button-help-popover').remove();
        });

        var buildPopup = function () {
          popup = angular.element('<div>' + scope.helpText + '<ul></ul></div>').addClass('mw-button-help-popover popover');
          angular.forEach(scope.hintsToShow, function (hint) {
            popup.find('ul').append('<li>' + hint.text + '</li>');
          });
        };

        scope.$watch('hintsToShow', function (newVal) {
          if (newVal.length) {
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

  .directive('mwCollapsable', function () {
    return {
      transclude: true,
      scope: {
        mwCollapsable: '=',
        title: '@mwTitle'
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_collapsable.html',
      link: function (scope, elm) {
        scope.viewModel = {};
        scope.viewModel.collapsed = false;
        if (scope.mwCollapsable === false) {
          scope.viewModel.collapsed = true;
        }
        var level = elm.parents('.mw-collapsable').length;
        if (level) {
          elm.css('margin-left', level * 20 + 'px');
        }

        scope.toggle = function () {
          scope.viewModel.collapsed = !scope.viewModel.collapsed;
        };
      }
    };
  });
angular.module('mwUI.UiComponents')
  //TODO remove relution dependency
  .directive('mwIcon', function () {
    return {
      restrict: 'A',
      scope: {
        mwIcon: '@',
        tooltip: '@',
        placement: '@',
        style: '@'
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_icon.html',
      link: function (scope, el) {

        el.addClass('mw-icon');
        //set icon classes
        scope.$watch('mwIcon', function (newVal) {
          if (newVal) {
            var isFontAwesome = angular.isArray(scope.mwIcon.match(/^fa-/)),
              isRlnIcon = angular.isArray(scope.mwIcon.match(/rln-icon/));
            if (isFontAwesome) {
              scope.iconClasses = 'fa ' + scope.mwIcon;
            } else if (isRlnIcon) {
              scope.iconClasses = 'rln-icon ' + scope.mwIcon;
            } else {
              scope.iconClasses = 'glyphicon glyphicon-' + scope.mwIcon;
            }
          }
        });
      }
    };
  });
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
        type: "@mwPanel",
        title: "@",
        closeable: "="
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_panel.html',
      link: function(scope, el){
        scope.closePanel = function(){
          el.remove();
        }
      }
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
  })
angular.module('mwUI.UiComponents')
  //Todo rename
  .directive('mwTextCollapse', ['$filter', function ($filter) {
    return {
      restrict: 'A',
      scope: {
        mwTextCollapse: '@',
        length: '=',
        markdown: '='
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_text_collapsable.html',
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
            scope.mwTextCollapse, scope.filterLength
          );
        };

        // show Button if text is longer than desired
        scope.showButton = false;
        if (scope.mwTextCollapse.length > scope.defaultLength) {
          scope.showButton = true;
        }

        // set button to "show more" or "show less"
        scope.showLessOrMore = function () {
          if (scope.filterLength === scope.defaultLength) {
            return 'UiComponents.mwTextCollapsable.showMore';
          } else {
            return 'UiComponents.mwTextCollapsable.showLess';
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
  }])

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
  }])

angular.module('mwUI.UiComponents')

  .directive('mwToggle', ['$timeout', function ($timeout) {
    return {
      scope: {
        mwModel: '=',
        mwDisabled: '=',
        mwChange: '&'
      },
      replace: true,
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_toggle.html',
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

  .config(['i18nProvider', function(i18nProvider){
    i18nProvider.addResource('uikit/mw-ui-components/i18n');
  }]);

})(window, angular);