angular.module('mwUI.UiComponents')

  .directive('mwBreadCrumb', function () {
    return {
      scope: {
        url: '@',
        title: '@'
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_bread_crumb.html'
    };
  });