angular.module('mwUI.List')

  //Todo rename to mwList
  .directive('mwListableBb', function(){
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

        this.registerColumn = function (scope, isOptional) {
          var column = {scope: scope, isOptional: isOptional, id: scope.$id, pos: _columns.length};
          _columns.push(column);
          $scope.$emit('mwList:registerColumn', column);
        };

        this.unRegisterColumn = function (scope) {
          if (scope && scope.$id) {
            var scopeInArray = _.findWhere(_columns, {id: scope.$id}),
              indexOfScope = _.indexOf(_columns, scopeInArray);

            if (indexOfScope > -1) {
              _columns.splice(indexOfScope, 1);
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

  .directive('mwListableBb', function(){
    return {
      require: 'mwListableBb',
      link: function(scope, el, attr, mwListCtrl){
        var manageColumVisibility = function(){
          mwListCtrl.getColumns().forEach(function(column){
            if(column.isOptional){
              el.addClass('hidden-col-'+column.pos);
            }
          });
        };

        var throttledHandler = _.throttle(manageColumVisibility, 100);

        scope.$on('mwList:registerColumn', throttledHandler);
      }
    };
  });