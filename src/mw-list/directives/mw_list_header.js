angular.module('mwUI.List')

  //TODO rename to mwListHeader
  .directive('mwListableHeaderBb', function () {
    return {
      require: '^mwListableBb',
      scope: {
        property: '@sort'
      },
      transclude: true,
      replace: true,
      templateUrl: 'uikit/mw-list/directives/templates/mw_list_header.html',
      link: function (scope, elm, attr, mwListCtrl) {
        var ascending = '+',
          descending = '-',
          collection = mwListCtrl.getCollection();

        var getSortOrder = function () {
          if (collection && collection.filterable) {
            collection.filterable.getSortOrder();
          } else {
            return false;
          }
        };

        var sort = function (property, order) {
          var sortOrder = order + property;

          collection.filterable.setSortOrder(sortOrder);
          return collection.fetch();
        };


        scope.toggleSortOrder = function () {
          if (scope.property) {
            var sortOrder = ascending; //default
            if (getSortOrder() === ascending + scope.property) {
              sortOrder = descending;
            }
            sort(scope.property, sortOrder);
          }
        };

        scope.isSelected = function (prefix) {
          var sortOrder = getSortOrder();

          if (sortOrder && prefix) {
            return sortOrder === prefix + scope.property;
          } else if(sortOrder && !prefix){
            return (sortOrder === '+' + scope.property || sortOrder === '-' + scope.property);
          }
        };

        mwListCtrl.registerColumn(scope);

        scope.$on('$destroy', function () {
          mwListCtrl.unRegisterColumn(scope);
        });
      }
    };
  });