angular.module('mwUI.List')

//TODO rename to mwListBodyRow
  .directive('mwListableBodyRowBb', function ($timeout) {
    return {
      require: '^mwListableBb',
      controller: function($scope){
        this.getId = function(){
          return $scope.$id;
        };
      },
      compile: function (elm) {

        elm.prepend('<td  ng-if="collection.selectable && item.selectable" mw-list-body-row-checkbox item="item"></td>');
        elm.append('<td ng-if="actionColumns.length == 0" width="1%" class="configurator-col"></td>');

        return function (scope, elm, attr, mwListCtrl) {
          var selectedClass = 'selected';

          scope.collection = mwListCtrl.getCollection();
          scope.actionColumns = mwListCtrl.actionColumns;

          if (!scope.item) {
            throw new Error('No item available in the list! Please make sure to use ng-repeat="item in collection"');
          }

          if (scope.item && scope.item.selectable && !scope.item.selectable.isDisabled()) {
            elm.addClass('selectable clickable');
          } else if (mwListCtrl.actionColumns && mwListCtrl.actionColumns.length > 0) {
            elm.addClass('clickable');
          }

          elm.on('click', function () {
            if (scope.item && scope.item.selectable && !scope.item.selectable.isDisabled()) {
              $timeout(function () {
                scope.item.selectable.toggleSelect();
              });
            }
          });

          elm.on('dblclick', function () {
            var rowId = scope.$id;
            if (mwListCtrl.actionColumns) {
              var columnActions = _.findWhere(mwListCtrl.actionColumns, {id: rowId}),
                columnAction = columnActions.actions[0];
              if (columnAction) {
                $timeout(columnAction);
              }
            }
          });

          scope.$watch('item.selectable.isSelected()', function (value) {
            if (value) {
              elm.addClass(selectedClass);
            } else {
              elm.removeClass(selectedClass);
            }
          });
        };
      }
    };
  });