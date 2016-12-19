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
        order: '='
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
            id: scope.id || scope.url || scope.$id,
            label: scope.label,
            url: scope.url,
            icon: scope.icon,
            type: 'ENTRY',
            order: scope.order || 0
          }),
          entryHolder;

        scope.menuEntry = menuEntry;

        $timeout(function(){
          if (parentCtrl) {
            entryHolder = parentCtrl.getMenuEntry().get('subEntries');
          } else if (menuCtrl) {
            entryHolder = menuCtrl.getMenu();
          }

          if(entryHolder){
            if(entryHolder.get(menuEntry)){
              menuEntry.show();
            } else {
              entryHolder.add(menuEntry);
            }
          }
        });

        ctrl.setMenuEntry(menuEntry);

        scope.$on('$destroy', function(){
          if(entryHolder){
            entryHolder.remove(menuEntry);
          }
        });
      }
    };
  });