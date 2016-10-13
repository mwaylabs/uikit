angular.module('mwUI.Modal')

  .directive('mwModalFooter', function () {
    return {
      transclude: true,
      templateUrl: 'uikit/mw-modal/directives/templates/mw_modal_footer.html'
    };
  });