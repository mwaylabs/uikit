angular.module('mwUI.List')

  .directive('mwListFooterRow', function (Loading) {
    return {
      require: '^mwListableBb',
      templateUrl: 'uikit/templates/mwList/mw-list-footer.html',
      link: function (scope, elm, attr, mwListCtrl) {
        scope.Loading = Loading;
        scope.collection = mwListCtrl.getCollection();
        scope.columns = mwListCtrl.getColumns();
      }
    };
  });