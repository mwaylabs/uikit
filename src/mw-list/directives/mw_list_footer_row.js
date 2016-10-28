angular.module('mwUI.List')
  //TODO rename
  .directive('mwListableFooterBb', function () {
    return {
      require: '^mwListableBb',
      templateUrl: 'uikit/mw-list/directives/templates/mw_list_footer.html',
      link: function (scope, elm, attr, mwListCtrl) {
        scope.collection = mwListCtrl.getCollection();
        scope.columns = mwListCtrl.getColumns();

        scope.collection.on('request', function(){
          scope.isSyncronising = true;
        });

        scope.collection.on('sync error', function(){
          scope.isSyncronising = false;
        });

        scope.showSpinner = function(){
          return scope.isSyncronising && scope.collection.filterable.hasNextPage();
        };
      }
    };
  });