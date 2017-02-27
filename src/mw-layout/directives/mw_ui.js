angular.module('mwUI.Layout')

  .directive('mwUi', function (Modal) {
    return {
      transclude: true,
      templateUrl: 'uikit/mw-layout/directives/templates/mw_ui.html',
      link: function (scope) {
        scope.displayToasts = function(){
          return Modal.getOpenedModals().length === 0;
        }
      }
    };
  });