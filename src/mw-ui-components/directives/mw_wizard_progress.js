angular.module('mwUI.UiComponents')

  .directive('mwWizardProgress', function () {
    return {
      require: '^mwWizard',
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_wizard_progress.html',
      link: function (scope, el, attr, mwWizardCtrl) {
        var wizard = mwWizardCtrl.getWizard();
        scope.getProgress = function(){
          return ((wizard.getCurrentStepNumber()+1) / wizard.getAllSteps().length ) *100;
        }
      }
    };
  });