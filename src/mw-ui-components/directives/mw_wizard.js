angular.module('mwUI.UiComponents')

  .directive('mwWizard', function (Wizard) {
    return {
      scope: {
        wizard: '=mwWizard'
      },
      transclude: true,
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_wizard.html',
      controller: function ($scope) {

        var wizard = $scope.wizard || Wizard.createWizard(_.uniqueId('wizard_'));

        this.registerStep = function (scope, id) {
          wizard._registerStep(scope, id);
        };

        this.unRegisterStep = function (scope) {
          wizard._unRegisterStep(scope);
        };

        this.getWizard = function(){
          return wizard;
        };

        $scope.$on('$destroy', function () {
          wizard.destroy();
        });

      }
    };
  });