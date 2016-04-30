angular.module('mwUI.List')

  .directive('mwListBodyRowCheckbox', function () {
    return {
      restrict: 'A',
      require: '^mwListableBb',
      scope: {
        item: '='
      },
      templateUrl: 'uikit/mw-list/directives/templates/mw_list_body_row_checkbox.html',
      link: function (scope, elm, attr, mwListCtrl) {
        scope.isSingleSelection = mwListCtrl.isSingleSelection();
        scope.click = function (item, $event) {
          $event.stopPropagation();
          if (item.selectable) {
            item.selectable.toggleSelect();
          }
        };

        scope.$watch('item.selectable.isDisabled()', function (isDisabled) {
          if (isDisabled) {
            scope.item.selectable.unSelect();
          }
        });
      }
    };
  });