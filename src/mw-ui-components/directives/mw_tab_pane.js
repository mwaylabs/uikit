angular.module('mwUI.UiComponents')
  //TODO rename
  .directive('mwTabsPane', function () {
    return {
      scope: {
        title: '@mwTabsPane',
        icon: '@',
        tooltip: '@',
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