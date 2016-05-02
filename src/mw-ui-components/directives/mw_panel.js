angular.module('mwUI.UiComponents')

  .directive('mwPanel', function () {
    return {
      restrict: 'A',
      transclude: true,
      scope: {
        type: '@mwPanel',
        title: '@',
        closeable: '='
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_panel.html',
      link: function(scope, el){
        scope.closePanel = function(){
          el.remove();
        }
      }
    };
  });