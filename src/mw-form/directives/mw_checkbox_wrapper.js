angular.module('mwUI.Form')

  .directive('mwCheckboxWrapper', function () {
    return {
      transclude: true,
      scope: {
        label: '@',
        tooltip: '@'
      },
      templateUrl: 'uikit/mw-form/directives/templates/mw_checkbox_wrapper.html'
    };
  });