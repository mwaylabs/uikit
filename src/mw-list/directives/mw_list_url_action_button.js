angular.module('mwUI.List')
  //TODO rename to mwListUrlActionButton
  .directive('mwListableLinkShowBb', function () {
    return {
      restrict: 'A',
      require: '^mwListableBb',
      template: '<span mw-link-show="{{link}}" link-target="{{linkTarget}}"></span>',
      link: function (scope, elm, attr, mwListableCtrl) {
        var updateLink = function(link){
          if(_.isNumber(scope.$index) && link){
            var existingItem = _.findWhere(mwListableCtrl.actionColumns, {id: scope.$index});

            if(existingItem){
              existingItem.link = link;
            } else {
              mwListableCtrl.actionColumns.push({id: scope.$index, link: link});
            }
          }
          scope.link = link;
        };

        var removeLink = function(){
          if(scope.$index){
            var existingItem = _.findWhere(mwListableCtrl.actionColumns, {id:scope.$index});
            if(existingItem){
              var indexOfExistingItem = _.indexOf(mwListableCtrl.actionColumns, existingItem);
              mwListableCtrl.actionColumns.splice(indexOfExistingItem, 1)
            }
          }
        };

        scope.linkTarget = attr.linkTarget;
        updateLink(attr.mwListableLinkShowBb);
        attr.$observe('mwListableLinkShowBb', updateLink);
        scope.$on('$destroy', removeLink);
      }
    };
  });