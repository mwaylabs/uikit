angular.module('mwUI.Modal')

  .directive('mwModalBody', function () {
    return {
      transclude: true,
      templateUrl: 'uikit/mw-modal/directives/templates/mw_modal_body.html'
    };
  });