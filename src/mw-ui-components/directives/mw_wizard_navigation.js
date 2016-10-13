angular.module('mwUI.UiComponents')

  .directive('mwWizardNavigation', function () {
    return {
      scope: {
        finishedAction: '&'
      },
      transclude: true,
      require: '^mwWizard',
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_wizard_navigation.html',
      link: function (scope, el, attr, mwWizardCtrl, $transclude) {
        scope.wizard = mwWizardCtrl.getWizard();
        scope.finish = function(){
          scope.$eval(scope.finishedAction);
        };

        $transclude(function (clone) {
          var wizardEl = el.find('.mw-wizard-navigation');

          if ((clone && clone.length > 0)) {
            wizardEl.addClass('has-extra-content');
          }
        });
      }
    };
  });