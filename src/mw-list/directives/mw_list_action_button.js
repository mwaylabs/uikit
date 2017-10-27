angular.module('mwUI.List')

  .directive('mwListableAction', function ($timeout) {
    return {
      require: ['^mwListableBb', '^?mwListableBodyRowBb'],
      transclude: true,
      templateUrl: 'uikit/mw-list/directives/templates/mw_list_action_button.html',
      scope: {
        action: '&mwListableAction'
      },
      link: function (scope, elm, attr, ctrls) {
        var id,
          mwListableCtrl = ctrls[0],
          mwlistableBodyRowBbCtrl = ctrls[1];

        var addAction = function () {
          if (_.isNumber(id)) {
            var action = scope.action;
            var existingItem = _.findWhere(mwListableCtrl.actionColumns, {id: id});

            if (!existingItem) {
              var item = {id: id, actions: [action]};
              mwListableCtrl.actionColumns.push(item);
              existingItem = item;
            } else {
              existingItem.actions.push(action);
            }

            if(existingItem.actions.length > mwListableCtrl.maxActionColumnsAmount){
              mwListableCtrl.maxActionColumnsAmount = existingItem.actions.length;
            }
          }
        };

        var removeAction = function () {
          if (_.isNumber(id)) {
            var existingItem = _.findWhere(mwListableCtrl.actionColumns, {id: id});
            if (existingItem) {
              var indexOfExistingAction = _.indexOf(existingItem.actions, scope.action);
              existingItem.actions.splice(indexOfExistingAction, 1);

              if(existingItem.actions.length===0){
                var indexOfExistingItem = _.indexOf(mwListableCtrl.actionColumns, existingItem);
                mwListableCtrl.actionColumns.splice(indexOfExistingItem, 1);
              }
            }
          }
        };

        scope.execute = function () {
          $timeout(scope.action);
        };

        if (mwlistableBodyRowBbCtrl) {
          id = mwlistableBodyRowBbCtrl.getId();
        }

        addAction(attr.action);
        scope.$on('$destroy', removeAction);
      }
    };
  });