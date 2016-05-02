angular.module('mwUI.List')
  //TODO rename
  .directive('mwListableFooterBb', function (Loading) {
    return {
      require: '^mwListableBb',
      templateUrl: 'uikit/mw-list/directives/templates/mw_list_footer.html',
      link: function (scope, elm, attr, mwListCtrl) {
        scope.Loading = Loading;
        scope.collection = mwListCtrl.getCollection();
        scope.columns = mwListCtrl.getColumns();
      }
    };
  });