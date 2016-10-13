angular.module('mwUI.List')

  //TODO rename to mwListBodyRow
  .directive('mwListableBodyRowBb', function ($timeout) {
    return {
      restrict: 'A',
      require: '^mwListableBb',
      compile: function (elm) {

        elm.prepend('<td  ng-if="collection.selectable && item.selectable" mw-list-body-row-checkbox item="item"></td>');

        return function (scope, elm, attr, mwListCtrl) {
          var selectedClass = 'selected';

          scope.collection = mwListCtrl.getCollection();

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
            if (mwListCtrl.actionColumns && angular.isNumber(scope.$index) && mwListCtrl.actionColumns[scope.$index]) {
              document.location.href = mwListCtrl.actionColumns[scope.$index];
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