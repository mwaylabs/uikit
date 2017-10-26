angular.module('mwUI.List')

  //TODO rename to mwListHeaderRow
  .directive('mwListableHeaderRowBb', function () {
    return {
      require: '^mwListableBb',
      scope: true,
      compile: function (elm) {
        elm.prepend('<th ng-if="hasCollection" width="1%"></th>');
        elm.append('<th ng-if="actionColumns && getActionColumnsAmount() > 0" colspan="{{ getActionColumnsAmount() }}" width="1%" class="action-button"><div ng-if="enableConfigurator" mw-list-column-configurator></div></th>');
        elm.append('<th ng-if="enableConfigurator && getActionColumnsAmount() == 0" width="1%" class="configurator-col"><div mw-list-column-configurator></div></th>');

        return function (scope, elm, attr, mwListCtrl) {
          //empty collection is [] so ng-if would not work as expected
          //we also have to check if the collection has a selectable
          scope.hasCollection = false;
          var collection = mwListCtrl.getCollection();
          if (collection) {
            scope.hasCollection = angular.isDefined(collection.length) && collection.selectable;
          }
          scope.actionColumns = mwListCtrl.actionColumns;
          scope.enableConfigurator = mwListCtrl.enableConfigurator;

          scope.getActionColumnsAmount = function(){
            return mwListCtrl.maxActionColumnsAmount;
          };
        };
      }
    };
  });