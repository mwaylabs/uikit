angular.module('mwUI.Menu')

  .directive('mwMenuEntry', function ($timeout) {
    return {
      scope: {
        id: '@',
        url: '@',
        icon: '@',
        label: '@',
        type: '@',
        target: '@',
        class: '@styleClass',
        order: '=',
        activeUrls: '=',
        action: '&',
        isActive: '&'
      },
      templateUrl: 'uikit/mw-menu/directives/templates/mw_menu_entry.html',
      require: ['mwMenuEntry', '?^^mwMenuEntry', '?^mwMenuTopEntries'],
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
          menuEntry = new mwUI.Menu.MwMenuEntry(),
          timeouts = [],
          entryHolder;

        var getDomOrder = function () {
          var orderDomEl = el;

          while (true) {
            if (orderDomEl.parent('.mw-menu-entry').length !== 0 || orderDomEl.parent('.mw-menu-entries').length !== 0) {
              break;
            }
            orderDomEl = orderDomEl.parent();
          }

          return orderDomEl.index() + 1;
        };

        var tryToRegisterAtParent = function () {
          if (parentCtrl) {
            if (!parentCtrl.getMenuEntry()) {
              // TODO could not produce that error. In case the following exception is thrown write a test case and comment line in
              //return $timeout(tryToRegisterAtParent);
              throw new Error('Menu entry is not available, so registration failed!');
            }
            entryHolder = parentCtrl.getMenuEntry().get('subEntries');
          } else if (menuCtrl) {
            entryHolder = menuCtrl.getMenu();
          }

          if (entryHolder && !entryHolder.get(menuEntry)) {
            entryHolder.add(menuEntry);
          }
        };

        var setMenuEntry = function () {
          menuEntry.set({
            id: scope.id || scope.url || scope.label || scope.$id,
            label: scope.label,
            url: scope.url,
            icon: scope.icon,
            type: scope.type || 'ENTRY',
            target: scope.target,
            order: scope.order || getDomOrder(),
            activeUrls: scope.activeUrls || [],
            class: scope.class,
            action: attrs.action ? function () {
              scope.action();
            } : null,
            isActive: attrs.isActive ? function () {
              return scope.isActive();
            } : null
          });
        };

        setMenuEntry();

        scope.menuEntry = menuEntry;

        timeouts.push($timeout(tryToRegisterAtParent));

        ctrl.setMenuEntry(menuEntry);

        menuEntry.get('subEntries').on('add remove reset change:order', function () {
          scope.$emit('mw-menu:triggerReorder');
        });

        menuEntry.on('change:order', function () {
          scope.$emit('mw-menu:triggerResort');
        });

        scope.$on('mw-menu:reorder', function () {
          if (!scope.order) {
            menuEntry.set('order', getDomOrder());
          }
        });

        scope.$on('mw-menu:resort', function () {
          menuEntry.get('subEntries').sort();
        });

        scope.$on('$destroy', function () {
          timeouts.forEach(function (timeoutPromise) {
            $timeout.cancel(timeoutPromise);
          });

          if (entryHolder) {
            entryHolder.remove(menuEntry);
          }

          menuEntry = null;
          ctrl.setMenuEntry(menuEntry);
        });

        scope.$watchGroup(['id', 'label', 'url', 'icon', 'class', 'order', 'target'], setMenuEntry);
      }
    };
  });