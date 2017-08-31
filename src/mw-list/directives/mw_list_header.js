angular.module('mwUI.List')

//TODO rename to mwListHeader
  .directive('mwListableHeaderBb', function ($rootScope, $timeout, mwBootstrapBreakpoint) {
    return {
      require: '^mwListableBb',
      scope: {
        property: '@?sort',
        title: '@?',
        hidden: '=?', // can be an array with the bootstrap breakproints ['xs','sm','md','lg'] to hide column for a breakpoint or a boolean
        mandatory: '=?' // when mandotory user can not unselect column
      },
      transclude: true,
      replace: true,
      templateUrl: 'uikit/mw-list/directives/templates/mw_list_header.html',
      link: function (scope, elm, attr, mwListCtrl) {
        var ascending = '+',
          descending = '-',
          collection = mwListCtrl.getCollection(),
          hidden;

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

        var getColumn = function () {
          return {
            scope: scope,
            pos: elm.index(),
            id: scope.$id
          };
        };

        var setTitle = function () {
          if (!attr.title) {
            scope.title = elm.text().trim();
          }
        };

        var updateCol = function () {
          $timeout(function(){
            scope.pos = elm.index();
            setTitle();
            mwListCtrl.updateColumn(getColumn());
          });
        };

        var throttledUpdateCol = _.debounce(updateCol, 100);

        var updateVisibility = function(){
          if (!mwListCtrl.enableConfigurator) {
            hidden = false;
          }
          var activeBreakPoint = mwBootstrapBreakpoint.getActiveBreakpoint();
          if(_.isArray(scope.hidden)){
            hidden = scope.hidden.indexOf(activeBreakPoint) !== -1;
          } else if(_.isBoolean(scope.hidden)){
            hidden = scope.hidden;
          }
        };

        scope.getTitle = function () {
          return scope.title || '';
        };

        scope.isVisible = function () {
          if (angular.isUndefined(hidden)) {
            return elm.is(':visible');
          } else {
            return !hidden;
          }
        };

        scope.hideColumn = function () {
          hidden = true;
          mwListCtrl.updateColumn(getColumn());
        };

        scope.showColumn = function () {
          hidden = false;
          mwListCtrl.updateColumn(getColumn());
        };

        scope.toggleColumn = function () {
          if (!scope.isVisible() || scope.isMandatory()) {
            scope.showColumn();
          } else {
            scope.hideColumn();
          }
        };

        scope.resetColumnVisibility = function(){
          hidden = void(0);
          mwListCtrl.updateColumn(getColumn());
        };

        scope.canBeSorted = function () {
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
          } else if (sortOrder && !prefix) {
            return (sortOrder === '+' + scope.property || sortOrder === '-' + scope.property);
          }
        };

        scope.isMandatory = function(){
          return scope.mandatory;
        };

        mwListCtrl.registerColumn(getColumn());

        scope.$on('$destroy', function () {
          mwListCtrl.unRegisterColumn(getColumn());
        });

        scope.$on('mwList:registerColumn', throttledUpdateCol);
        scope.$on('mwList:registerColumn', throttledUpdateCol);
        scope.$on('mwList:unRegisterColumn', throttledUpdateCol);
        scope.$watch('hidden', updateVisibility);
        attr.$observe('title', throttledUpdateCol);
        $rootScope.$on('i18n:localeChanged', throttledUpdateCol);
        $rootScope.$on('mwBootstrapBreakpoint:changed', throttledUpdateCol);
        $rootScope.$on('mwBootstrapBreakpoint:changed', updateVisibility);
        $rootScope.$on('$modalOpenSuccess', updateVisibility);
        $timeout(throttledUpdateCol);
      }
    };
  });