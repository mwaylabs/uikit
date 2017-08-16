angular.module('mwUI.List')

//Todo rename to mwList
  .directive('mwListableBb', function () {
    return {
      //TODO rename collection to mwCollection
      //Move sort and filter persistance into filterable and remove mwListCollection
      scope: {
        collection: '=',
        mwListCollection: '='
      },
      compile: function (elm) {
        elm.append('<tfoot mw-listable-footer-bb></tfoot>');

        return function (scope, elm) {
          elm.addClass('table table-striped mw-list');
        };
      },
      controller: function ($scope) {
        var _columns = $scope.columns = [],
          _collection = null,
          _mwListCollectionFilter = null;

        this.actionColumns = [];

        var notifyColumns = function (event, affectedCol) {
          $scope.$emit(event, affectedCol);
          _columns.forEach(function (column) {
            column.scope.$broadcast(event, affectedCol);
          });
        };

        this.registerColumn = function (column) {
          _columns.push(column);
          notifyColumns('mwList:registerColumn');
        };

        this.updateColumn = function (column) {
          if (column && column.id) {
            var scopeInArray = _.findWhere(_columns, {id: column.id}),
              indexOfScope = _.indexOf(_columns, scopeInArray);

            if (indexOfScope > -1) {
              var existingColumn = _columns[indexOfScope];
              _.extend(existingColumn, column);
              notifyColumns('mwList:updateColumn', existingColumn);
            }
          }
        };

        this.unRegisterColumn = function (column) {
          if (column && column.id) {
            var scopeInArray = _.findWhere(_columns, {id: column.id}),
              indexOfScope = _.indexOf(_columns, scopeInArray);

            if (indexOfScope > -1) {
              _columns.splice(indexOfScope, 1);
              notifyColumns('mwList:unRegisterColumn', _columns[indexOfScope]);
            }
          }
        };

        this.getColumns = function () {
          return _columns;
        };

        this.getCollection = function () {
          return _collection;
        };

        this.isSingleSelection = function () {
          if (_collection && _collection.selectable) {
            return _collection.selectable.isSingleSelection();
          }
          return false;
        };

        $scope.$on('$destroy', function () {
          this.actionColumns = [];
        }.bind(this));

        if ($scope.mwListCollection) {
          _collection = $scope.mwListCollection.getCollection();
          _mwListCollectionFilter = $scope.mwListCollection.getMwListCollectionFilter();
        } else if ($scope.collection) {
          _collection = $scope.collection;
        }
      }
    };
  })

  .directive('mwListableBb', function () {
    return {
      require: 'mwListableBb',
      link: function (scope, el, attr, mwListCtrl) {
        var makeAllColumnsVisible = function () {
          el.removeClass(function (index, className) {
            return (className.match(/(^|\s)hidden-col-\S+/g) || []).join(' ');
          });
        };

        var manageColumVisibility = function () {
          makeAllColumnsVisible();
          mwListCtrl.getColumns().forEach(function (column) {
            if (!column.scope.isVisible()) {
              el.addClass('hidden-col-' + column.pos);
            }
          });
        };

        var throttledHandler = _.throttle(manageColumVisibility, 100);

        scope.$on('mwList:registerColumn', throttledHandler);
        scope.$on('mwList:unRegisterColumn', throttledHandler);
        scope.$on('mwList:updateColumn', throttledHandler);
      }
    };
  });