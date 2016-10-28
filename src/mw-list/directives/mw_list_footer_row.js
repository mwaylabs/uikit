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
          scope.isSynchronising = true;
        });

        scope.collection.on('sync error', function(){
          scope.isSynchronising = false;
        });

        scope.showSpinner = function(){
          return scope.isSynchronising && scope.collection.filterable.hasNextPage();
        };
      }
    };
  });