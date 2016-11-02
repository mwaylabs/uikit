angular.module('mwUI.List')
  //TODO rename to mwListUrlActionButton
  .directive('mwListableLinkShowBb', function () {
    return {
      restrict: 'A',
      require: '^mwListableBb',
      scope: {
        link: '@mwListableLinkShowBb',
        target: '@?'
      },
      template: '<span mw-link-show="{{link}}" link-target="{{target}}"></span>',
      link: function (scope, elm, attr, mwListableCtrl) {
        mwListableCtrl.actionColumns.push(scope.link);
      }
    };
  });