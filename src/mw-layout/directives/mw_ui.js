angular.module('mwUI.Layout')

  .directive('mwUi', function (Modal) {
    return {
      transclude: true,
      templateUrl: 'uikit/mw-layout/directives/templates/mw_ui.html',
      controller: function($scope){
        this.addClass = function(styleClass){
          $scope.addClass(styleClass);
        };
        this.removeClass = function(styleClass){
          $scope.removeClass(styleClass);
        };
      },
      link: function (scope, el) {
        scope.displayToasts = function(){
          return Modal.getOpenedModals().length === 0;
        };

        scope.addClass = function(styleClass){
          console.log('ADD CLASS', styleClass);
          el.addClass(styleClass)
        };

        scope.removeClass = function(styleClass){
          console.log('REMOVE CLASS', styleClass);
          el.removeClass(styleClass);
        };
      }
    };
  });