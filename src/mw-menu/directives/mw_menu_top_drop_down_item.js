angular.module('mwUI.Menu')

  .directive('mwMenuTopDropDownItem', function () {
    return {
      scope: {
        entry: '=mwMenuTopDropDownItem'
      },
      templateUrl: 'uikit/mw-menu/directives/templates/mw_menu_top_drop_down_item.html'
    };
  });