angular.module('mwUI.Modal')

  .directive('mwModalFooter', function () {
    return {
      transclude: true,
      templateUrl: 'uikit/mw-modal/directives/templates/mw_modal_footer.html',
      require: '^mwModal',
      link: function(scope, el, attrs, mwModalCtrl){
        mwModalCtrl.addClass('has-footer');
      }
    };
  });