angular.module('mwUI.Modal')

  .directive('mwModal', function (mwModalTmpl) {
    return {
      restrict: 'A',
      scope: {
        title: '@'
      },
      transclude: true,
      templateUrl: 'uikit/mw-modal/directives/templates/mw_modal.html',
      controller: function($scope){
        this.addClass = function(styleClass){
          $scope.addClass(styleClass);
        }
      },
      link: function (scope, el) {
        scope.$emit('COMPILE:FINISHED');
        scope.mwModalTmpl = mwModalTmpl;
        scope.addClass = function(styleClass){
          el.addClass(styleClass)
        };

        if(scope.title){
          scope.addClass('has-header');
        }
      }
    };
  });