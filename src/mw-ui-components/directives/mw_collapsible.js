angular.module('mwUI.UiComponents')

  //TODO rename to mwCollapsible
  .directive('mwCollapsable', function () {
    return {
      transclude: true,
      scope: {
        mwCollapsable: '=',
        title: '@mwTitle'
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_collapsible.html',
      link: function (scope) {
        scope.viewModel = {};
        scope.viewModel.collapsed = false;

        scope.toggle = function () {
          scope.viewModel.collapsed = !scope.viewModel.collapsed;
        };

        if (scope.mwCollapsable === false) {
          scope.viewModel.collapsed = true;
        }
      }
    };
  });