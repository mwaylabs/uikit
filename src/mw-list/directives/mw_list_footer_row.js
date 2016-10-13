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