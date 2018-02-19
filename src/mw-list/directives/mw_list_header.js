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
          innerText = elm.text() || '',
          tableConfigurator = mwListCtrl.getTableConfigurator(),
          persistId = scope.property || attr.title || innerText.trim(),
          systemHasHiddenElement = true,
          userHasHiddenElement;

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
            id: scope.$id,
            persistId: persistId
          };
        };

        var setTitle = function () {
          if (!attr.title) {
            scope.title = elm.text().trim();
          }
        };

        var updateCol = function () {
          $timeout(function () {
            scope.pos = elm.index();
            setTitle();
            mwListCtrl.updateColumn(getColumn());
          });
        };

        var throttledUpdateCol = _.debounce(updateCol, 100);

        var isHiddenByBootstrapClass = function () {
          var bootstrapHiddenClass = elm.attr('class').match(/hidden-[a-z]{2}/g),
            bootstrapVisibleClass = elm.attr('class').match(/visible-[a-z]{2}/g),
            activeBreakPoint = mwBootstrapBreakpoint.getActiveBreakpoint(),
            hiddenByBootstrap = false;

          if (bootstrapHiddenClass) {
            bootstrapHiddenClass.forEach(function (className) {
              if (!hiddenByBootstrap && className.split('-')[1] === activeBreakPoint.toLowerCase()) {
                hiddenByBootstrap = true;
              }
            });
          }

          if (bootstrapVisibleClass) {
            hiddenByBootstrap = true;
            bootstrapVisibleClass.forEach(function (className) {
              if (hiddenByBootstrap && className.split('-')[1] === activeBreakPoint.toLowerCase()) {
                hiddenByBootstrap = false;
              }
            });
          }

          return hiddenByBootstrap;
        };

        var isHiddenByHiddenAttr = function () {
          var activeBreakPoint = mwBootstrapBreakpoint.getActiveBreakpoint(),
            hiddenByHiddenAttr = false;

          if (angular.isArray(scope.hidden)) {
            hiddenByHiddenAttr = scope.hidden.indexOf(activeBreakPoint) !== -1;
          } else if (_.isBoolean(scope.hidden)) {
            hiddenByHiddenAttr = scope.hidden;
          } else if (angular.isDefined(attr.hidden)) {
            hiddenByHiddenAttr = true;
          }

          return hiddenByHiddenAttr;
        };

        var updateVisibility = function () {
          systemHasHiddenElement = isHiddenByHiddenAttr() || isHiddenByBootstrapClass();
        };

        var throttledUpdateVisibility = _.debounce(updateVisibility, 100);

        scope.hideColumn = function () {
          userHasHiddenElement = true;
          mwListCtrl.updateColumn(getColumn());
        };

        scope.showColumn = function () {
          userHasHiddenElement = false;
          mwListCtrl.updateColumn(getColumn());
        };

        scope.toggleColumn = function () {
          if (!scope.isVisible() || scope.isMandatory()) {
            scope.showColumn();
          } else {
            scope.hideColumn();
          }
        };

        scope.resetColumnVisibility = function () {
          userHasHiddenElement = void(0);
          mwListCtrl.updateColumn(getColumn());
        };

        scope.getTitle = function () {
          return scope.title || '';
        };

        scope.isVisible = function () {
          if (angular.isUndefined(userHasHiddenElement)) {
            return !systemHasHiddenElement;
          } else {
            return !userHasHiddenElement;
          }
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

        scope.isMandatory = function () {
          return scope.mandatory;
        };

        scope.$on('$destroy', function () {
          mwListCtrl.unRegisterColumn(getColumn());
        });
        scope.$on('mwList:registerColumn', throttledUpdateCol);
        scope.$on('mwList:registerColumn', throttledUpdateCol);
        scope.$on('mwList:unRegisterColumn', throttledUpdateCol);
        scope.$watch('hidden', throttledUpdateVisibility);
        attr.$observe('title', throttledUpdateCol);
        var unbindLocaleChange = $rootScope.$on('i18n:localeChanged', throttledUpdateCol);
        var unbindBootstrapChangeUpdateCol = $rootScope.$on('mwBootstrapBreakpoint:changed', throttledUpdateCol);
        var unbindBootstrapChangeUpdateVisibility = $rootScope.$on('mwBootstrapBreakpoint:changed', throttledUpdateVisibility);
        var unbindModalOpen = $rootScope.$on('$modalOpenSuccess', throttledUpdateVisibility);

        if (tableConfigurator) {
          var persistedCol = tableConfigurator.get('columns').get(persistId);
          if (persistedCol) {
            userHasHiddenElement = !persistedCol.get('visible');
          }
        }

        $timeout(function () {
          updateCol();
          updateVisibility();
          mwListCtrl.registerColumn(getColumn());
        });

        scope.$on('$destroy', function(){
          unbindLocaleChange();
          unbindBootstrapChangeUpdateCol();
          unbindBootstrapChangeUpdateVisibility();
          unbindModalOpen();
        });
      }
    };
  });