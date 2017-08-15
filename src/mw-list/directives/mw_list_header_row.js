angular.module('mwUI.List')

  //TODO rename to mwListHeaderRow
  .directive('mwListableHeaderRowBb', function () {
    return {
      require: '^mwListableBb',
      scope: true,
      compile: function (elm) {
        elm.prepend('<th ng-if="hasCollection" mw-listable-header-bb width="1%"></th>');
        elm.append('<th ng-if="actionColumns.length > 0" mw-listable-header-bb colspan="{{ actionColumns.length }}" width="1%" class="action-button"></th>');

        return function (scope, elm, attr, mwListCtrl) {
          //empty collection is [] so ng-if would not work as expected
          //we also have to check if the collection has a selectable
          scope.hasCollection = false;
          var collection = mwListCtrl.getCollection();
          if (collection) {
            scope.hasCollection = angular.isDefined(collection.length) && collection.selectable;
          }
          scope.actionColumns = mwListCtrl.actionColumns;
        };
      }
    };
  });