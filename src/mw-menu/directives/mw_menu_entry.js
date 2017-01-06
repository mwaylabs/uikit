/**
 * Created by zarges on 23/02/16.
 */
angular.module('mwUI.Menu')

  .directive('mwMenuEntry', function ($timeout) {
    return {
      scope: {
        id: '@',
        url: '@',
        icon: '@',
        label: '@',
        type: '@',
        order: '=',
        activeUrls: '='
      },
      templateUrl: 'uikit/mw-menu/directives/templates/mw_menu_entry.html',
      controllerAs: 'menuEntryCtrl',
      require: ['mwMenuEntry', '?^^mwMenuEntry', '?^mwMenuTop'],
      transclude: true,
      controller: function () {
        var _menuEntry;

        this.setMenuEntry = function (menuEntry) {
          _menuEntry = menuEntry;
        };

        this.getMenuEntry = function () {
          return _menuEntry;
        };
      },
      link: function (scope, el, attrs, ctrls) {
        var ctrl = ctrls[0],
          parentCtrl = ctrls[1],
          menuCtrl = ctrls[2],
          menuEntry = new mwUI.Menu.MwMenuEntry({
            id: scope.id || scope.url || scope.label || scope.$id,
            label: scope.label,
            url: scope.url,
            icon: scope.icon,
            type: scope.type || 'ENTRY',
            order: scope.order,
            activeUrls: scope.activeUrls || []
          }),
          entryHolder;

        console.log(menuEntry.get('id'))

        var getDomOrder = function () {
          var orderDomEl = el;

          while (true) {
            if (orderDomEl.parent('.mw-menu-entry').length !== 0 || orderDomEl.parent('.mw-menu-entries').length !== 0) {
              break;
            }
            orderDomEl = orderDomEl.parent();
          }

          return orderDomEl.index();
        };

        scope.menuEntry = menuEntry;

        $timeout(function () {
          if (parentCtrl) {
            entryHolder = parentCtrl.getMenuEntry().get('subEntries');
          } else if (menuCtrl) {
            entryHolder = menuCtrl.getMenu();
          }

          if (entryHolder) {
            if (entryHolder.get(menuEntry)) {
              menuEntry.show();
            } else {
              entryHolder.add(menuEntry);
            }
          }
        });

        ctrl.setMenuEntry(menuEntry);

        menuEntry.get('subEntries').on('add remove reset', function(){
          scope.$emit('mw-menu:triggerReorder');
        });

        scope.$on('mw-menu:reorder', function(){
          if(!scope.order){
            menuEntry.set('order', getDomOrder());
            scope.$emit('mw-menu:triggerResort');
          }
        });

        scope.$on('mw-menu:resort', function(){
            menuEntry.get('subEntries').sort();
        });

        scope.$on('$destroy', function () {
          if (entryHolder) {
            entryHolder.remove(menuEntry);
          }
        });
      }
    };
  });