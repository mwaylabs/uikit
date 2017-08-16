angular.module('mwUI.List')

  //TODO rename to mwListHeader
  .directive('mwListableHeaderBb', function ($rootScope, $timeout) {
    return {
      require: '^mwListableBb',
      scope: {
        property: '@?sort',
        title: '@?',
        hidden: '=?'
      },
      transclude: true,
      replace: true,
      templateUrl: 'uikit/mw-list/directives/templates/mw_list_header.html',
      link: function (scope, elm, attr, mwListCtrl, $transclude) {
        var ascending = '+',
          descending = '-',
          collection = mwListCtrl.getCollection();

        var getSortOrder = function () {
          if (collection && collection.filterable) {
            return collection.filterable.getSortOrder();
          } else {
            return false;
          }
        };

        var sort = function (property, order) {
          var sortOrder = order + property;

          collection.filterable.setSortOrder(sortOrder);
          return collection.fetch();
        };

        var getColumn = function(){
          return {
            scope: scope,
            pos: elm.index(),
            id: scope.$id
          }
        };

        var setTitle = function(){
          if(!attr.title){
            scope.title = elm.text().trim();
          }
        };

        var updateCol = function(){
          scope.pos = elm.index();
          setTitle();
          mwListCtrl.updateColumn(getColumn());
        };

        var throttledUpdateCol = _.throttle(updateCol, 100);

        scope.getTitle = function(){
          return scope.title || '';
        };

        scope.isVisible = function(){
          return !scope.hidden;
        };

        scope.hideColumn = function(){
          scope.hidden = true;
          mwListCtrl.updateColumn(getColumn());
        };

        scope.showColumn= function(){
          scope.hidden = false;
          mwListCtrl.updateColumn(getColumn());
        };

        scope.toggleColumn = function(){
          if(scope.hidden){
            scope.showColumn();
          } else {
            scope.hideColumn();
          }
        };

        scope.canBeSorted = function(){
          return angular.isString(scope.property) && scope.property.length > 0 && !!collection.filterable;
        };

        scope.toggleSortOrder = function () {
          if (scope.canBeSorted()) {
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

        mwListCtrl.registerColumn(scope, scope.isOptional);

        scope.$on('$destroy', function () {
          mwListCtrl.unRegisterColumn(scope, scope.isOptional);
        });
      }
    };
  });