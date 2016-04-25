angular.module('mwUI.List')

  //TODO rename
  .directive('mwListableLinkShowBb', function () {
    return {
      restrict: 'A',
      require: '^mwListableBb',
      scope: {
        link: '@mwListableLinkShowBb'
      },
      template: '<span mw-link-show="{{link}}"></span>',
      link: function (scope, elm, attr, mwListableCtrl) {
        mwListableCtrl.actionColumns.push(scope.link);
      }
    };
  });